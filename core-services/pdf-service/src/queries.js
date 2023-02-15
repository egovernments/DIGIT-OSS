const { Pool } = require('pg');
import logger from "./config/logger";
import producer from "./kafka/producer";
import envVariables from "./EnvironmentVariables";
import PDFMerger from 'pdf-merger-js';
import { fileStoreAPICall, getFilestoreUrl } from "./utils/fileStoreAPICall";
import fs, {
  exists
} from "fs";

const pool = new Pool({
  user: envVariables.DB_USER,
  host: envVariables.DB_HOST,
  database: envVariables.DB_NAME,
  password: envVariables.DB_PASSWORD,
  port: envVariables.DB_PORT,
})

let createJobKafkaTopic = envVariables.KAFKA_CREATE_JOB_TOPIC;
const uuidv4 = require("uuid/v4");

export const getFileStoreIds = (
  jobid,
  tenantId,
  isconsolidated,
  entityid,
  callback
) => {
  var searchquery = "";
  var queryparams = [];
  var next = 1;
  var jobidPresent = false;
  searchquery = "SELECT * FROM egov_pdf_gen WHERE";

  if (jobid != undefined && jobid.length > 0) {
    searchquery += ` jobid = ANY ($${next++})`;
    queryparams.push(jobid);
    jobidPresent = true;
  }

  if (entityid != undefined && entityid.trim() !== "") {
    if (jobidPresent) searchquery += " and";
    searchquery += ` entityid = ($${next++})`;
    queryparams.push(entityid);
  }

  if (tenantId != undefined && tenantId.trim() !== "") {
    searchquery += ` and tenantid = ($${next++})`;
    queryparams.push(tenantId);
  }

  if (isconsolidated != undefined && isconsolidated.trim() !== "") {
    var ifTrue = isconsolidated === "true" || isconsolidated === "True";
    var ifFalse = isconsolidated === "false" || isconsolidated === "false";
    if (ifTrue || ifFalse) {
      searchquery += ` and isconsolidated = ($${next++})`;
      queryparams.push(ifTrue);
    }
  }
  searchquery = `SELECT pdf_1.* FROM egov_pdf_gen pdf_1 INNER JOIN (SELECT entityid, max(endtime) as MaxEndTime from (`+searchquery+`) as pdf_2 group by entityid) pdf_3 ON pdf_1.entityid = pdf_3.entityid AND pdf_1.endtime = pdf_3.MaxEndTime`;
  pool.query(searchquery, queryparams, (error, results) => {
    if (error) {
      logger.error(error.stack || error);
      callback({
        status: 400,
        message: `error occured while searching records in DB : ${error.message}`
      });
    } else {
      if (results && results.rows.length > 0) {
        var searchresult = [];
        results.rows.map(crow => {
          searchresult.push({
            filestoreids: crow.filestoreids,
            jobid: crow.jobid,
            tenantid: crow.tenantid,
            createdtime: crow.createdtime,
            endtime: crow.endtime,
            totalcount: crow.totalcount,
            key: crow.key,
            documentType: crow.documenttype,
            moduleName: crow.modulename
          });
        });
        logger.info(results.rows.length + " matching records found in search");
        callback({ status: 200, message: "Success", searchresult });
      } else {
        logger.error("no result found in DB search");
        callback({ status: 404, message: "no matching result found" });
      }
    }
  });
};

export const insertStoreIds = (
  dbInsertRecords,
  jobid,
  filestoreids,
  tenantId,
  starttime,
  successCallback,
  errorCallback,
  totalcount,
  key,
  documentType,
  moduleName
) => {
  var payloads = [];
  var endtime = new Date().getTime();
  var id = uuidv4();
  payloads.push({
    topic: createJobKafkaTopic,
    messages: JSON.stringify({ jobs: dbInsertRecords })
  });
  producer.send(payloads, function(err, data) {
    if (err) {
      logger.error(err.stack || err);
      errorCallback({
        message: `error while publishing to kafka: ${err.message}`
      });
    } else {
      logger.info("jobid: " + jobid + ": published to kafka successfully");
      successCallback({
        message: "Success",
        jobid: jobid,
        filestoreIds: filestoreids,
        tenantid: tenantId,
        starttime,
        endtime,
        totalcount,
        key,
        documentType,
        moduleName
      });
    }
  });
};

export async function insertRecords(bulkPdfJobId, totalPdfRecords, currentPdfRecords, userid, tenantId, locality, bussinessService, consumerCode, isConsolidated) {
  try {
    const result = await pool.query('select * from egov_bulk_pdf_info where jobid = $1', [bulkPdfJobId]);
    if(result.rowCount<1){
      const insertQuery = 'INSERT INTO egov_bulk_pdf_info(jobid, uuid, recordscompleted, totalrecords, createdtime, filestoreid, lastmodifiedby, lastmodifiedtime, tenantid, locality, businessservice, consumercode, isconsolidated, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)';
      const curentTimeStamp = new Date().getTime();
      const status = 'INPROGRESS';
      await pool.query(insertQuery,[bulkPdfJobId, userid, currentPdfRecords, totalPdfRecords, curentTimeStamp, null, userid, curentTimeStamp, tenantId, locality, bussinessService, consumerCode, isConsolidated, status]);
    }
    else{
      var recordscompleted = parseInt(result.rows[0].recordscompleted);
      var totalrecords = parseInt(result.rows[0].totalrecords);
      if(recordscompleted < totalrecords){
        const updateQuery = 'UPDATE egov_bulk_pdf_info SET recordscompleted = recordscompleted + $1, lastmodifiedby = $2, lastmodifiedtime = $3 WHERE jobid = $4';
        const curentTimeStamp = new Date().getTime();
        await pool.query(updateQuery,[currentPdfRecords, userid, curentTimeStamp, bulkPdfJobId]);
      }
    }
  } catch (err) {
    logger.error(err.stack || err);
  } 
}

export async function mergePdf(bulkPdfJobId, tenantId, userid, numberOfFiles, mobileNumber){

  try {
    const updateResult = await pool.query('select * from egov_bulk_pdf_info where jobid = $1', [bulkPdfJobId]);
    var recordscompleted = parseInt(updateResult.rows[0].recordscompleted);
    var totalrecords = parseInt(updateResult.rows[0].totalrecords);
    var baseFolder = envVariables.SAVE_PDF_DIR + bulkPdfJobId + '/';
    //var baseFolder = process.cwd() + '/' + bulkPdfJobId + '/';
    
    let fileNames = fs.readdirSync(baseFolder);
    
    if(recordscompleted >= totalrecords && fileNames.length == numberOfFiles){
      var merger = new PDFMerger();
    
      logger.info('Files to be merged: ',fileNames);
      (async () => {
        var processStatus = updateResult.rows[0].status;
        if(processStatus != 'CANCEL'){
          try {
            for (let i = 0; i < fileNames.length; i++){
              logger.info(baseFolder+fileNames[i]);
              merger.add(baseFolder+fileNames[i]);            //merge all pages. parameter is the path to file and filename.
            }
            await merger.save(baseFolder+'/output.pdf');        //save under given name and reset the internal document
          } catch (err) {
            logger.error(err.stack || err);
          }
      
          var mergePdfData = fs.createReadStream(baseFolder+'output.pdf');
          await fileStoreAPICall('output.pdf', tenantId, mergePdfData).then((filestoreid) => {
            const updateQuery = 'UPDATE egov_bulk_pdf_info SET filestoreid = $1, lastmodifiedby = $2, lastmodifiedtime = $3, status = $5 WHERE jobid = $4';
            const curentTimeStamp = new Date().getTime();
            const status = 'DONE';
            pool.query(updateQuery,[filestoreid, userid, curentTimeStamp, bulkPdfJobId, status]);
            sendNoitification(filestoreid, mobileNumber, tenantId);
        
          }).catch((err) => {
            logger.error(err.stack || err);
          });
        }

        try {
          if( fs.existsSync(baseFolder) ) {
            fs.readdirSync(baseFolder).forEach(function(file,index){
              var curPath = baseFolder + file;
              if(fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
              } else { // delete file
                fs.unlinkSync(curPath);
              }
            });
            fs.rmdirSync(baseFolder);
          }
        } catch (error) {
          logger.error(error.stack || error);
          var errorPlayloads = [];
          
          errorPlayloads.push({
            topic: envVariables.KAFKA_PDF_ERROR_TOPIC,
            messages: error
          });
          producer.send(errorPlayloads, function(err, data) {
            if (err) {
              logger.error(err.stack || err);
              errorCallback({
                message: `error while publishing to kafka: ${err.message}`
              });
            } 
          });
        }
        

      })();
    }
  } catch (err) {
    logger.error(err.stack || err);
  }
  
}

export async function sendNoitification(filestoreid, mobileNumber, tenantId){
  const topic = envVariables.KAFKA_TOPICS_NOTIFICATION;
  var pdfLink = await getFilestoreUrl(filestoreid, tenantId);
  let smsRequest = {};
  smsRequest['mobileNumber'] = mobileNumber;
  smsRequest['message'] = "Your download is ready. It will expire in 24 hours. Please click on the link below to download the pdf.\n"+pdfLink;
  let payloads = [];
  payloads.push({
    topic,
    messages: JSON.stringify(smsRequest)
  });

  producer.send(payloads, function(err, data) {
    if (!err) {
      console.log(data);
    } else {
      console.log(err);
    }
  });
}




export async function getBulkPdfRecordsDetails(userid, offset, limit, jobId){
  try {
    let data = [];
    let param;
    let query = 'select * from egov_bulk_pdf_info where ';
    if(jobId){
      query = query + 'jobid = $1 ';
      param = jobId;
    }
    else{
      query = query + 'uuid = $1 ';
      param = userid;
    }

    query = query + 'limit $2 offset $3';

    const result = await pool.query(query, [param, limit, offset]);
    if(result.rowCount>=1){
      
      for(let row of result.rows){
        let value = {
          jobid: row.jobid,
          uuid: row.uuid,
          totalrecords: row.totalrecords,
          recordscompleted: row.recordscompleted,
          filestoreid: row.filestoreid,
          createdtime: row.createdtime,
          lastmodifiedby: row.lastmodifiedby,
          lastmodifiedtime: row.lastmodifiedtime,
          tenantId: row.tenantid,
          locality: row.locality,
          bussinessService: row.businessservice,
          consumercode: row.consumercode,
          isConsolidated: row.isconsolidated,
          status: row.status
        };
        data.push(value);
      }
    }
    return data;
    
  } catch (err) {
    logger.error(err.stack || err);
    
  }

}

export async function cancelBulkPdfProcess(requestInfo, jobId, userid){
  let errorMap = [];
  try{
    const result = await pool.query('select * from egov_bulk_pdf_info where jobid = $1 and uuid = $2', [jobId, userid]);
    if(result.rowCount==1){
      var recordscompleted = parseInt(result.rows[0].recordscompleted);
      var totalrecords = parseInt(result.rows[0].totalrecords);
      if(recordscompleted == totalrecords){
        let error = {
          message: `Not allowed to cancel already completed process`,
        };
        errorMap.push(error);
        return errorMap;
      }
      const updateQuery = 'UPDATE egov_bulk_pdf_info SET status = $1, lastmodifiedby = $2, lastmodifiedtime = $3 WHERE jobid = $4';
      const curentTimeStamp = new Date().getTime();
      const status = 'CANCEL';
      await pool.query(updateQuery,[status, userid, curentTimeStamp, jobId]);
  
    }
    else{
      let error = {
        message: `No process with jobId: ${jobId} present for ${requestInfo.userInfo.userName}`,
      };
      errorMap.push(error);
      return errorMap;
    }
  }catch (err){
    logger.error(err.stack || err);
    let error = {
      message: `Error occured while getting details from database`,
    };
    errorMap.push(error);
    return errorMap;
  }
  
}