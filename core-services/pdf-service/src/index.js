"use strict";
import http from "http";
import request from "request";
import express from "express";
import logger from "./config/logger";
import path from "path";
import fs, {
  exists
} from "fs";
import axios from "axios";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import asyncHandler from "express-async-handler";
import * as pdfmake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import get from "lodash/get";
import set from "lodash/set";
import {
  strict
} from "assert";
import {
  Recoverable
} from "repl";
import {
  fileStoreAPICall
} from "./utils/fileStoreAPICall";
import {
  directMapping
} from "./utils/directMapping";
import {
  externalAPIMapping
} from "./utils/externalAPIMapping";
import envVariables from "./EnvironmentVariables";
import QRCode from "qrcode";
import {
  getValue
} from "./utils/commons";
import {
  getFileStoreIds,
  insertStoreIds,
  insertRecords,
  mergePdf,
  getBulkPdfRecordsDetails,
  cancelBulkPdfProcess
} from "./queries";
import {
  listenConsumer
} from "./kafka/consumer";
import {
  convertFooterStringtoFunctionIfExist,
  findLocalisation,
  getDateInRequiredFormat
} from "./utils/commons";


let v8 = require("v8");
let totalHeapSizeInGB = (((v8.getHeapStatistics().total_available_size) / 1024 / 1024 / 1024).toFixed(2));
console.log(`*******************************************`);
console.log(`Total Heap Size ~ ${totalHeapSizeInGB} GB`);
console.log(`*******************************************`);



var jp = require("jsonpath");
//create binary
pdfMake.vfs = pdfFonts.pdfMake.vfs;
var pdfMakePrinter = require("pdfmake/src/printer");

let app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json({
  limit: "200mb",
  extended: true
}));
app.use(bodyParser.urlencoded({
  limit: "200mb",
  extended: true,
  parameterLimit:50000
}));

let maxPagesAllowed = envVariables.MAX_NUMBER_PAGES;
let serverport = envVariables.SERVER_PORT;

let dataConfigUrls = envVariables.DATA_CONFIG_URLS;
let formatConfigUrls = envVariables.FORMAT_CONFIG_URLS;

let dataConfigMap = {};
let formatConfigMap = {};

let topicKeyMap = {};
var topic = [];
var datafileLength = dataConfigUrls.split(",").length;
let unregisteredLocalisationCodes = [];

var fontDescriptors = {
  Cambay: {
    normal: "src/fonts/Cambay-Regular.ttf",
    bold: "src/fonts/Cambay-Bold.ttf",
    italics: "src/fonts/Cambay-Italic.ttf",
    bolditalics: "src/fonts/Cambay-BoldItalic.ttf",
  },
  Roboto: {
    bold: "src/fonts/Roboto-Bold.ttf",
    normal: "src/fonts/Roboto-Regular.ttf",
  },
  BalooBhaina: {
    normal: "src/fonts/BalooBhaina2-Regular.ttf",
    bold: "src/fonts/BalooBhaina2-Bold.ttf"
  },
  BalooPaaji:{
    normal: "src/fonts/BalooPaaji2-Regular.ttf",
    bold: "src/fonts/BalooPaaji2-Bold.ttf"
  }
};

var defaultFontMapping = {
  en_IN: 'default',
  hi_IN: 'default',
  pn_IN: 'BalooPaaji',
  od_IN: 'BalooBhaina'
}

const printer = new pdfMakePrinter(fontDescriptors);
const uuidv4 = require("uuid/v4");

let mustache = require("mustache");
mustache.escape = function (text) {
  return text;
};
let borderLayout = {
  hLineColor: function (i, node) {
    return "#979797";
  },
  vLineColor: function (i, node) {
    return "#979797";
  },
  hLineWidth: function (i, node) {
    return 0.5;
  },
  vLineWidth: function (i, node) {
    return 0.5;
  },
};

/**
 *
 * @param {*} key - name of the key used to identify module configs. Provided request URL
 * @param {*} listDocDefinition - doc definitions as per pdfmake and formatconfig, each for each file
 * @param {*} successCallback - callaback when success
 * @param {*} errorCallback - callback when error
 * @param {*} tenantId - tenantID
 */
const createPdfBinary = async (
  key,
  listDocDefinition,
  entityIds,
  formatconfig,
  successCallback,
  errorCallback,
  tenantId,
  starttime,
  totalobjectcount,
  userid,
  documentType,
  moduleName
) => {
  try {
    let noOfDefinitions = listDocDefinition.length;

    var jobid = `${key}${new Date().getTime()}`;
    if (noOfDefinitions == 0) {
      logger.error("no file generated for pdf");
      errorCallback({
        message: " error: no file generated for pdf"
      });
    } else {
      var dbInsertSingleRecords = [];
      var dbInsertBulkRecords = [];
      // instead of awaiting the promise, use process.nextTick to asynchronously upload the receipt
      //
      process.nextTick(function () {
        uploadFiles(
            dbInsertSingleRecords,
            dbInsertBulkRecords,
            formatconfig,
            listDocDefinition,
            key,
            false,
            jobid,
            noOfDefinitions,
            entityIds,
            starttime,
            successCallback,
            errorCallback,
            tenantId,
            totalobjectcount,
            userid,
            documentType,
            moduleName
          ),
          uploadFiles(
            dbInsertSingleRecords,
            dbInsertBulkRecords,
            formatconfig,
            listDocDefinition,
            key,
            true,
            jobid,
            noOfDefinitions,
            entityIds,
            starttime,
            successCallback,
            errorCallback,
            tenantId,
            totalobjectcount,
            userid,
            documentType,
            moduleName
          )
      });
    }
  } catch (err) {
    logger.error(err.stack || err);
    errorCallback({
      message: ` error occured while creating pdf: ${
        typeof err === "string" ? err : err.message
      }`,
    });
  }
};

const uploadFiles = async (
  dbInsertSingleRecords,
  dbInsertBulkRecords,
  formatconfig,
  listDocDefinition,
  key,
  isconsolidated,
  jobid,
  noOfDefinitions,
  entityIds,
  starttime,
  successCallback,
  errorCallback,
  tenantId,
  totalobjectcount,
  userid,
  documentType,
  moduleName
) => {
  let convertedListDocDefinition = [];
  let listOfFilestoreIds = [];

  if (!isconsolidated) {
    listDocDefinition.forEach((docDefinition) => {
      docDefinition["content"].forEach((defn) => {
        var formatobject = JSON.parse(JSON.stringify(formatconfig));
        formatobject["content"] = defn;
        convertedListDocDefinition.push(formatobject);
      });
    });
  } else {
    convertedListDocDefinition = [...listDocDefinition];
  }

  convertedListDocDefinition.forEach(function (docDefinition, i) {
    // making copy because createPdfKitDocument function modifies passed object and this object is used
    // in multiple places
    var objectCopy = JSON.parse(JSON.stringify(docDefinition));
    // restoring footer because JSON.stringify destroys function() values
    objectCopy.footer = convertFooterStringtoFunctionIfExist(
      formatconfig.footer
    );
    const doc = printer.createPdfKitDocument(objectCopy);
    let fileNameAppend = "-" + new Date().getTime();
    // let filename="src/pdfs/"+key+" "+fileNameAppend+".pdf"
    let filename = key + "" + fileNameAppend + ".pdf";
    //reference link
    //https://medium.com/@kainikhil/nodejs-how-to-generate-and-properly-serve-pdf-6835737d118e#d8e5

    //storing file on local computer/server

    var chunks = [];

    doc.on("data", function (chunk) {
      chunks.push(chunk);
    });
    doc.on("end", function () {
      // console.log("enddddd "+cr++);
      var data = Buffer.concat(chunks);
      fileStoreAPICall(filename, tenantId, data)
        .then((result) => {
          listOfFilestoreIds.push(result);
          if (!isconsolidated) {
            dbInsertSingleRecords.push({
              jobid,
              id: uuidv4(),
              createdby: userid,
              modifiedby: userid,
              entityid: entityIds[i],
              isconsolidated: false,
              filestoreids: [result],
              tenantId,
              createdtime: starttime,
              endtime: new Date().getTime(),
              totalcount: 1,
              key,
              documentType,
              moduleName,
            });

            // insertStoreIds(jobid,entityIds[i],[result],tenantId,starttime,successCallback,errorCallback,1,false);
          } else if (
            isconsolidated &&
            listOfFilestoreIds.length == noOfDefinitions
          ) {
            // insertStoreIds("",);
            // logger.info("PDF uploaded to filestore");
            dbInsertBulkRecords.push({
              jobid,
              id: uuidv4(),
              createdby: userid,
              modifiedby: userid,
              entityid: null,
              isconsolidated: true,
              filestoreids: listOfFilestoreIds,
              tenantId,
              createdtime: starttime,
              endtime: new Date().getTime(),
              totalcount: totalobjectcount,
              key,
              documentType,
              moduleName
            });
          }
          if (
            dbInsertSingleRecords.length == totalobjectcount &&
            dbInsertBulkRecords.length == 1
          ) {
            insertStoreIds(
              dbInsertSingleRecords.concat(dbInsertBulkRecords),
              jobid,
              listOfFilestoreIds,
              tenantId,
              starttime,
              successCallback,
              errorCallback,
              totalobjectcount,
              key,
              documentType,
              moduleName
            );
          }
        })
        .catch((err) => {
          logger.error(err.stack || err);
          errorCallback({
            message: "error occurred while uploading pdf: " + (typeof err === "string") ?
              err :
              err.message,
          });
        });
    });
    doc.end();
  });
};

app.post(
  "/pdf-service/v1/_create",
  asyncHandler(async (req, res) => {
    let requestInfo;
    try {
      requestInfo = get(req.body, "RequestInfo");
      await createAndSave(
        req,
        res,
        (response) => {
          // doc successfully created
          res.status(201);
          res.json({
            ResponseInfo: requestInfo,
            message: response.message,
            filestoreIds: response.filestoreIds,
            jobid: response.jobid,
            createdtime: response.starttime,
            endtime: response.endtime,
            tenantid: response.tenantid,
            totalcount: response.totalcount,
            key: response.key,
            documentType: response.documentType,
            moduleName: response.moduleName,
          });
        },
        (error) => {
          res.status(400);
          // doc creation error
          res.json({
            ResponseInfo: requestInfo,
            message: "error in createPdfBinary " + error.message,
          });
        }
      );
      //
    } catch (error) {
      logger.error(error.stack || error);
      res.status(400);
      res.json({
        ResponseInfo: requestInfo,
        message: "some unknown error while creating: " + error.message,
      });
    }
  })
);

app.post(
  "/pdf-service/v1/_createnosave",
  asyncHandler(async (req, res) => {
    let requestInfo;
    try {
      var starttime = new Date().getTime();
      let key = req.query.key;
      let tenantId = req.query.tenantId;
      var formatconfig = formatConfigMap[key];
      var dataconfig = dataConfigMap[key];
      logger.info("received createnosave request on key: " + key);
      requestInfo = get(req.body, "RequestInfo");
      //

      var valid = validateRequest(req, res, key, tenantId, requestInfo);

      if (valid) {
        let [
          formatConfigByFile,
          totalobjectcount,
          entityIds,
        ] = await prepareBegin(
          key,
          req,
          requestInfo,
          true,
          formatconfig,
          dataconfig
        );
        // restoring footer function
        formatConfigByFile[0].footer = convertFooterStringtoFunctionIfExist(formatconfig.footer);
        const doc = printer.createPdfKitDocument(formatConfigByFile[0]);
        let fileNameAppend = "-" + new Date().getTime();
        let filename = key + "" + fileNameAppend + ".pdf";

        var chunks = [];
        doc.on("data", function (chunk) {
          chunks.push(chunk);
        });
        doc.on("end", function () {
          // console.log("enddddd "+cr++);
          var data = Buffer.concat(chunks);
          res.writeHead(201, {
            // 'Content-Type': mimetype,
            "Content-disposition": "attachment;filename=" + filename,
            "Content-Length": data.length,
          });
          logger.info(
            `createnosave success for pdf with key: ${key}, entityId ${entityIds}`
          );
          res.end(Buffer.from(data, "binary"));
        });
        doc.end();
      }
    } catch (error) {
      logger.error(error.stack || error);
      res.status(400);
      res.json({
        message: "some unknown error while creating: " + error.message,
      });
    }
  })
);

app.post(
  "/pdf-service/v1/_search",
  asyncHandler(async (req, res) => {
    let requestInfo;
    try {
      let tenantid = req.query.tenantid;
      let jobid = req.query.jobid;
      let isconsolidated = req.query.isconsolidated;
      let entityid = req.query.entityid;
      requestInfo = get(req.body, "RequestInfo");
      if (
        (jobid == undefined || jobid.trim() == "") &&
        (entityid == undefined || entityid.trim() == "")
      ) {
        res.status(400);
        res.json({
          ResponseInfo: requestInfo,
          message: "jobid and entityid both can not be empty",
        });
      } else {
        if (jobid) {
          if (jobid.includes(",")) {
            jobid = jobid.split(",");
          } else {
            jobid = [jobid];
          }
        }

        getFileStoreIds(
          jobid,
          tenantid,
          isconsolidated,
          entityid,
          (responseBody) => {
            // doc successfully created
            res.status(responseBody.status);
            delete responseBody.status;
            res.json({
              ResponseInfo: requestInfo,
              ...responseBody
            });
          }
        );
      }
    } catch (error) {
      logger.error(error.stack || error);
      res.status(400);
      res.json({
        ResponseInfo: requestInfo,
        message: "some unknown error while searching: " + error.message,
      });
    }
  })
);

app.post(
  "/pdf-service/v1/_getUnrigesteredCodes",
  asyncHandler(async (req, res) => {
    let requestInfo;
    try {
      requestInfo = get(req.body, "RequestInfo");
      res.status(200);
      res.json({
          ResponseInfo: requestInfo,
          unregisteredLocalisationCodes: unregisteredLocalisationCodes,
        });
    } catch (error) {
      logger.error(error.stack || error);
      res.status(400);
      res.json({
        ResponseInfo: requestInfo,
        message: "Error while retreving the codes",
      });
    }
  })

);

app.post(
  "/pdf-service/v1/_clearUnrigesteredCodes",
  asyncHandler(async (req, res) => {
    let requestInfo;
    try {
      requestInfo = get(req.body, "RequestInfo");
      let resposnseMap = await findLocalisation(
        requestInfo,
        [],
        unregisteredLocalisationCodes,
        null
      );

      resposnseMap.messages.map((item) => {
        if(unregisteredLocalisationCodes.includes(item.code)){
          var index = unregisteredLocalisationCodes.indexOf(item.code);
          unregisteredLocalisationCodes.splice(index, 1);
        }
      });
      res.status(200);
      res.json({
          ResponseInfo: requestInfo,
          unregisteredLocalisationCodes: unregisteredLocalisationCodes,
        });
    } catch (error) {
      logger.error(error.stack || error);
      res.status(400);
      res.json({
        ResponseInfo: requestInfo,
        message: "Error while retreving the codes",
      });
    }
  })

);

app.post(
  "/pdf-service/v1/_getBulkPdfRecordsDetails",
  asyncHandler(async (req, res) => {
    let requestInfo, uuid, offset, limit, jobId;
    try {
      requestInfo = get(req.body, "RequestInfo");
      uuid = requestInfo.userInfo.uuid;
      offset = get(req.query, "offset");
      limit = get(req.query, "limit");
      jobId = get(req.query, "jobId");

      let data = await getBulkPdfRecordsDetails(uuid, offset, limit, jobId);
      if(data.length<=0){
        res.status(400);
        res.json({
            ResponseInfo: requestInfo,
            message: `Group bill pdf records details are not present for the employee ${requestInfo.userInfo.name} .Please trigger a bulk bill creation process`,
          });
      }
      else{
        res.status(200);
        res.json({
            ResponseInfo: requestInfo,
            groupBillrecords: data,
          });
      }

      
    } catch (error) {
      logger.error(error.stack || error);
      res.status(400);
      res.json({
        ResponseInfo: requestInfo,
        message: "Error while retreving the details",
      });
    }
  })

);

app.post(
  "/pdf-service/v1/_deleteBulkPdfRecordsDetails",
  asyncHandler(async (req, res) => {
    let requestInfo = get(req.body, "RequestInfo");
    try {
      let pdfDirectory = envVariables.SAVE_PDF_DIR;
      let folderNames = fs.readdirSync(pdfDirectory);

      for(let folder of folderNames){
        if(folder == 'lost+found')
          continue;
        let baseFolder = pdfDirectory + folder + '/';
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
      }
      
      res.status(200);
      res.json({
            ResponseInfo: requestInfo,
            Message: "Bulk PDF records details are clear",
      });
    } catch (error) {
      logger.error(error.stack || error);
      res.status(400);
      res.json({
        ResponseInfo: requestInfo,
        message: "Error while clearing the Bulk PDF records details",
      });
    }
  })

);

app.post(
  "/pdf-service/v1/_cancelProcess",
  asyncHandler(async (req, res) => {
    let requestInfo = get(req.body, "RequestInfo");
    let jobId = get(req.query, "jobId");
    let uuid = requestInfo.userInfo.uuid;
    try {

      if( !jobId || !uuid){
        res.status(400);
        res.json({
          ResponseInfo: requestInfo,
          message: "jobid or userid can not be empty",
        });
      }
      else{
        let errorMap = await cancelBulkPdfProcess(requestInfo, jobId, uuid);
        if(errorMap != undefined && errorMap.length>=1){
          res.status(400);
          res.json({
              ResponseInfo: requestInfo,
              errorMessage: errorMap,
        });
        }
        else{
          res.status(200);
          res.json({
                ResponseInfo: requestInfo,
                Message: `Bulk PDF process with job id: ${jobId} is cancel`,
          });
        }
        
      }
    } catch (error) {
      logger.error(error.stack || error);
      res.status(400);
      res.json({
        ResponseInfo: requestInfo,
        message: "Error while clearing the Bulk PDF records details",
      });
    }
  })

);

var i = 0;
dataConfigUrls &&
  dataConfigUrls.split(",").map((item) => {
    item = item.trim();
    if (item.includes("file://")) {
      item = item.replace("file://", "");
      fs.readFile(item, "utf8", function (err, data) {
        try {
          if (err) {
            logger.error(
              "error when reading file for dataconfig: file:///" + item
            );
            logger.error(err.stack);
          } else {
            data = JSON.parse(data);
            dataConfigMap[data.key] = data;
            /*if (data.fromTopic != null) {
              topicKeyMap[data.fromTopic] = data.key;
              topic.push(data.fromTopic);
            }*/
            i++;
            // if (i == datafileLength) {
            //   topic.push(envVariables.KAFKA_RECEIVE_CREATE_JOB_TOPIC)
            //   listenConsumer(topic);
            // }
            logger.info("loaded dataconfig: file:///" + item);
          }
        } catch (error) {
          logger.error("error in loading dataconfig: file:///" + item);
          logger.error(error.stack);
        }
      });
    } else {
      (async () => {
        try {
          var response = await axios.get(item);
          dataConfigMap[response.data.key] = response.data;
          logger.info("loaded dataconfig: " + item);
        } catch (error) {
          logger.error("error in loading dataconfig: " + item);
          logger.error(error.stack);
        }
      })();
    }
  });

formatConfigUrls &&
  formatConfigUrls.split(",").map((item) => {
    item = item.trim();
    if (item.includes("file://")) {
      item = item.replace("file://", "");
      fs.readFile(item, "utf8", function (err, data) {
        try {
          if (err) {
            logger.error(err.stack);
            logger.error(
              "error when reading file for formatconfig: file:///" + item
            );
          } else {
            data = JSON.parse(data);
            formatConfigMap[data.key] = data.config;
            logger.info("loaded formatconfig: file:///" + item);
          }
        } catch (error) {
          logger.error("error in loading formatconfig: file:///" + item);
          logger.error(error.stack);
        }
      });
    } else {
      (async () => {
        try {
          var response = await axios.get(item);
          formatConfigMap[response.data.key] = response.data.config;
          logger.info("loaded formatconfig: " + item);
        } catch (error) {
          logger.error("error in loading formatconfig: " + item);
          logger.error(error.stack);
        }
      })();
    }
  });

app.listen(serverport, () => {
  logger.info(`Server running at http:${serverport}/`);
});

topic.push(envVariables.KAFKA_RECEIVE_CREATE_JOB_TOPIC)
listenConsumer(topic);

/**
 *
 * @param {*} formatconfig - format config read from formatconfig file
 */

// Create endpoint flow
// createAndSave-> prepareBegin-->prepareBulk --> handlelogic-------------|
// createPdfBinary<---prepareBegin <--createPdfBinary <------prepareBulk ---<

export const createAndSave = async (
  req,
  res,
  successCallback,
  errorCallback
) => {
  var starttime = new Date().getTime();

  let topic = get(req, "pdfKey");
  let key;
  if (topic != null) {
    key = topic;
  } else {
    key = get(req.query || req, "key");
  }
  //let key = get(req.query || req, "key");
  let tenantId = get(req.query || req, "tenantId");
  var formatconfig = formatConfigMap[key];
  var dataconfig = dataConfigMap[key];
  var userid = get(req.body || req, "RequestInfo.userInfo.id");
  var requestInfo = get(req.body || req, "RequestInfo");
  var documentType = get(dataconfig, "documentType", "");
  var moduleName = get(dataconfig, "DataConfigs.moduleName", "");

  var valid = validateRequest(req, res, key, tenantId, requestInfo);
  if (valid) {
    let [formatConfigByFile, totalobjectcount, entityIds] = await prepareBegin(
      key,
      req,
      requestInfo,
      false,
      formatconfig,
      dataconfig
    );

    // logger.info(`Applied templating engine on ${moduleObjectsArray.length} objects output will be in ${formatConfigByFile.length} files`);
    logger.info(
      `Applied templating engine on ${totalobjectcount} objects output will be in ${formatConfigByFile.length} files`
    );
    // var util = require('util');
    // fs.writeFileSync('./data.txt', util.inspect(JSON.stringify(formatconfig)) , 'utf-8');
    //function to download pdf automatically
    
    let formatconfigCopy = JSON.parse(JSON.stringify(formatconfig));

    let locale = requestInfo.msgId.split('|')[1];
    if(!locale)
      locale = envVariables.DEFAULT_LOCALISATION_LOCALE;

    if(defaultFontMapping[locale] != 'default')
      formatconfigCopy.defaultStyle.font = defaultFontMapping[locale];

    createPdfBinary(
      key,
      formatConfigByFile,
      entityIds,
      formatconfigCopy,
      successCallback,
      errorCallback,
      tenantId,
      starttime,
      totalobjectcount,
      userid,
      documentType,
      moduleName
    ).catch((err) => {
      logger.error(err.stack || err);
      errorCallback({
        message: "error occurred in createPdfBinary call: " + (typeof err === "string") ?
          err :
          err.message,
      });
    });
  }
};

export const createNoSave = async (
  req,
  res,
  successCallback,
  errorCallback
) => {
  try {
    var starttime = new Date().getTime();
    var topic = get(req, "pdfKey");
    var key;
    if (topic != null) {
      key = topic;
    } else {
      key = get(req.query || req, "key");
    }

    var tenantId = get(req.query || req, "tenantId");
    var formatconfig = formatConfigMap[key];
    var dataconfig = dataConfigMap[key];
    var totalPdfRecords = get(req, "totalPdfRecords");
    var currentPdfRecords = get(req, "currentPdfRecords");
    var bulkPdfJobId = get(req, "pdfJobId");
    var numberOfFiles = get(req, "numberOfFiles");
    var requestInfo = get(req.body || req, "RequestInfo");
    var userid = get(req.body || req, "RequestInfo.userInfo.uuid");
    var mobileNumber = get(req, "RequestInfo.userInfo.mobileNumber");
    var billd = get(req, "Bill");
    var locality = get(req, "locality");
    var bussinessService = get(req, "service");
    var isConsolidated = get(req, "isConsolidated");
    var consumerCode = get(req, "consumerCode");
    

    logger.info("received createnosave request on key: " + key + " for job id:" + bulkPdfJobId +" totalPdfRecords: "+totalPdfRecords+" currentPdfRecords: "+currentPdfRecords + " size: "+billd.length);

    var valid = validateRequest(req, res, key, tenantId, requestInfo);

    if (valid) {
      let [
        formatConfigByFile,
        totalobjectcount,
        entityIds,
      ] = await prepareBegin(
        key,
        req,
        requestInfo,
        true,
        formatconfig,
        dataconfig
      );
      // restoring footer function
      formatConfigByFile[0].footer = convertFooterStringtoFunctionIfExist(formatconfig.footer);
      const doc = printer.createPdfKitDocument(formatConfigByFile[0]);
      let fileNameAppend = "-" + new Date().getTime();
      let directory = envVariables.SAVE_PDF_DIR + bulkPdfJobId
      //let directory = bulkPdfJobId;

      if(!fs.existsSync(directory))
        fs.mkdirSync(directory, { recursive: true });

      let filename = directory + "/"  + key + "" + fileNameAppend + ".pdf";

      var chunks = [];
      doc.on("data", function (chunk) {
        chunks.push(chunk);
      });
      doc.on("end", function () {
        var data = Buffer.concat(chunks);
         //fs.createWriteStream(filename).write(data);
         var tempFile = fs.createWriteStream(filename);
         tempFile.on('error', function(e) { console.error(e); });
         tempFile.on('open', function(fd) {
           tempFile.write(data);
           tempFile.end();
         });
        logger.info(
          `createnosave success for pdf creation with job id: ${bulkPdfJobId} with key: ${key}, entityId ${entityIds}`
        );
        (async () => {
          await insertRecords(bulkPdfJobId, totalPdfRecords, currentPdfRecords, userid, tenantId, locality, bussinessService, consumerCode, isConsolidated);
          await mergePdf(bulkPdfJobId, tenantId, userid, numberOfFiles, mobileNumber);
        })();
      });
      doc.end();

    }
  } catch (error) {
    logger.error(error.stack || error);
    // res.json({
    //   message: "some unknown error while creating: " + error.message,
    // });
  }

};


const updateBorderlayout = (formatconfig) => {
  formatconfig.content = formatconfig.content.map((item) => {
    if (
      item.hasOwnProperty("layout") &&
      typeof item.layout === "object" &&
      Object.keys(item.layout).length === 0
    ) {
      item.layout = borderLayout;
    }
    return item;
  });
  return formatconfig;
};

/**
 *
 * @param {*} variableTovalueMap - key, value map. Keys are variable defined in data config
 * and value is their corresponding values. Map will be used by Moustache template engine
 * @param {*} formatconfig -format config read from formatconfig file
 */
export const fillValues = (variableTovalueMap, formatconfig) => {
  let input = JSON.stringify(formatconfig).replace(/\\/g, "");
  
  //console.log(variableTovalueMap);
  //console.log(mustache.render(input, variableTovalueMap).replace(/""/g,"\"").replace(/"\[/g,"\[").replace(/\]"/g,"\]").replace(/\]\[/g,"\],\[").replace(/"\{/g,"\{").replace(/\}"/g,"\}"));
  let output = JSON.parse(
    mustache
      .render(input, variableTovalueMap)
      .replace(/""/g, '\""')
      //.replace(/\\/g, "")
      .replace(/"\[/g, "[")
      .replace(/\]"/g, "]")
      .replace(/\]\[/g, "],[")
      .replace(/"\{/g, "{")
      .replace(/\n/g, "\\n")
      .replace(/\t/g, "\\t")      
  );
  return output;
};

/**
 * generateQRCodes-function to geneerate qrcodes
 * moduleObject-current module object from request body
 * dataconfig- data config read from dataconfig of module
 */
const generateQRCodes = async (
  moduleObject,
  dataconfig,
  variableTovalueMap
) => {
  let qrcodeMappings = getValue(
    jp.query(dataconfig, "$.DataConfigs.mappings.*.mappings.*.qrcodeConfig.*"),
    [],
    "$.DataConfigs.mappings.*.mappings.*.qrcodeConfig.*"
  );

  for (var i = 0, len = qrcodeMappings.length; i < len; i++) {
    let qrmapping = qrcodeMappings[i];
    let varname = qrmapping.variable;
    let qrtext = mustache.render(qrmapping.value, variableTovalueMap);

    let qrCodeImage = await QRCode.toDataURL(qrtext);
    variableTovalueMap[varname] = qrCodeImage;
  }
};

const handleDerivedMapping = (dataconfig, variableTovalueMap) => {
  let derivedMappings = getValue(
    jp.query(dataconfig, "$.DataConfigs.mappings.*.mappings.*.derived.*"),
    [],
    "$.DataConfigs.mappings.*.mappings.*.derived.*"
  );

  for (var i = 0, len = derivedMappings.length; i < len; i++) {

    let mapping = derivedMappings[i];
    let expression = mustache
      .render(
        mapping.formula.replace(/-/g, " - ").replace(/\+/g, " + "),
        variableTovalueMap
      )
      .replace(/NA/g, "0");
    let type = mapping.type;
    let format = mapping.format;
    let variableValue = Function(`'use strict'; return (${expression})`)();
    if(type == "date"){
      let myDate = new Date(variableValue);
      if (isNaN(myDate) || variableValue === 0) {
        variableValue = "NA";
      } else {
        let replaceValue = getDateInRequiredFormat(variableValue,format);
        variableValue = replaceValue;
      }
    }
    variableTovalueMap[mapping.variable] = variableValue;
  }
};

const validateRequest = (req, res, key, tenantId, requestInfo) => {
  let errorMessage = "";
  if (key == undefined || key.trim() === "") {
    errorMessage += " key is missing,";
  }
  if (tenantId == undefined || tenantId.trim() === "") {
    errorMessage += " tenantId is missing,";
  }
  if (requestInfo == undefined) {
    errorMessage += " requestInfo is missing,";
  }
  if (requestInfo && requestInfo.userInfo == undefined) {
    errorMessage += " userInfo is missing,";
  }
  if (formatConfigMap[key] == undefined || dataConfigMap[key] == undefined) {
    errorMessage += ` no config found for key ${key}`;
  }
  if (res && errorMessage !== "") {
    res.status(400);
    res.json({
      message: errorMessage,
      ResponseInfo: requestInfo,
    });
    return false;
  } else {
    return true;
  }
};

const prepareBegin = async (
  key,
  req,
  requestInfo,
  returnFileInResponse,
  formatconfig,
  dataconfig
) => {
  var baseKeyPath = get(dataconfig, "DataConfigs.baseKeyPath");
  var entityIdPath = get(dataconfig, "DataConfigs.entityIdPath");
  if (baseKeyPath == null) {
    logger.error("baseKeyPath is absent in config");
    throw {
      message: `baseKeyPath is absent in config`
    };
  }
  return await prepareBulk(
    key,
    dataconfig,
    formatconfig,
    req,
    baseKeyPath,
    requestInfo,
    returnFileInResponse,
    entityIdPath
  );
};

const handlelogic = async (
  key,
  formatObject,
  moduleObject,
  dataconfig,
  isCommonTableBorderRequired,
  requestInfo
) => {
  let variableTovalueMap = {};
  //direct mapping service
  await Promise.all([
    directMapping(
      moduleObject,
      dataconfig,
      variableTovalueMap,
      requestInfo,
      unregisteredLocalisationCodes,
      key
    ),
    //external API mapping
    externalAPIMapping(
      key,
      moduleObject,
      dataconfig,
      variableTovalueMap,
      requestInfo,
      unregisteredLocalisationCodes
    ),
  ]);
  await generateQRCodes(moduleObject, dataconfig, variableTovalueMap);
  handleDerivedMapping(dataconfig, variableTovalueMap);
  formatObject = fillValues(variableTovalueMap, formatObject);
  if (isCommonTableBorderRequired === true)
    formatObject = updateBorderlayout(formatObject);
  return formatObject;
};

// const prepareSingle=(key)=>{
//   handlelogic();
// }

const prepareBulk = async (
  key,
  dataconfig,
  formatconfig,
  req,
  baseKeyPath,
  requestInfo,
  returnFileInResponse,
  entityIdPath
) => {
  let isCommonTableBorderRequired = get(
    dataconfig,
    "DataConfigs.isCommonTableBorderRequired"
  );
  let formatObjectArrayObject = [];
  let formatConfigByFile = [];
  let totalobjectcount = 0;
  let entityIds = [];
  let countOfObjectsInCurrentFile = 0;
  let moduleObjectsArray = getValue(
    jp.query(req.body || req, baseKeyPath),
    [],
    baseKeyPath
  );
  if (Array.isArray(moduleObjectsArray) && moduleObjectsArray.length > 0) {
    totalobjectcount = moduleObjectsArray.length;
    for (var i = 0, len = moduleObjectsArray.length; i < len; i++) {
      let moduleObject = moduleObjectsArray[i];
      let entityKey = getValue(
        jp.query(moduleObject, entityIdPath),
        [null],
        entityIdPath
      );
      entityIds.push(entityKey[0]);

      let formatObject = JSON.parse(JSON.stringify(formatconfig));

      // Multipage pdf, each pdf from new page
      if (
        formatObjectArrayObject.length != 0 &&
        formatObject["content"][0] !== undefined
      ) {
        formatObject["content"][0]["pageBreak"] = "before";
      }

      /////////////////////////////
      formatObject = await handlelogic(
        key,
        formatObject,
        moduleObject,
        dataconfig,
        isCommonTableBorderRequired,
        requestInfo
      );

      formatObjectArrayObject.push(formatObject["content"]);
      countOfObjectsInCurrentFile++;
      if (
        (!returnFileInResponse &&
          countOfObjectsInCurrentFile == maxPagesAllowed) ||
        i + 1 == len
      ) {
        let formatconfigCopy = JSON.parse(JSON.stringify(formatconfig));
        
        let locale = requestInfo.msgId.split('|')[1];
        if(!locale)
          locale = envVariables.DEFAULT_LOCALISATION_LOCALE;

        if(defaultFontMapping[locale] != 'default')
         formatconfigCopy.defaultStyle.font = defaultFontMapping[locale];

        formatconfigCopy["content"] = formatObjectArrayObject;
        formatConfigByFile.push(formatconfigCopy);
        formatObjectArrayObject = [];
        countOfObjectsInCurrentFile = 0;
      }
    }
    return [formatConfigByFile, totalobjectcount, entityIds];
  } else {
    logger.error(
      `could not find property of type array in request body with name ${baseKeyPath}`
    );
    throw {
      message: `could not find property of type array in request body with name ${baseKeyPath}`,
    };
  }
};
export default app;