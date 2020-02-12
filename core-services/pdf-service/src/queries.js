const Pool = require("pg").Pool;
import logger from "./config/logger";
import producer from "./kafka/producer";
// import consumer from "./kafka/consumer";
import envVariables from "./EnvironmentVariables";

const pool = new Pool({
  user: envVariables.DB_USER,
  host: envVariables.DB_HOST,
  database: envVariables.DB_NAME,
  password: envVariables.DB_PASSWORD,
  port: envVariables.DB_PORT
});

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
        status: 500,
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
            totalcount: crow.totalcount
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
  totalcount
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
        totalcount
      });
    }
  });
};
