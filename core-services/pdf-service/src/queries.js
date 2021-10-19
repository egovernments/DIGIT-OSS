const Pool = require("pg").Pool;
import logger from "./config/logger";
import producer from "./kafka/producer";
import consumer from "./kafka/consumer";
import envVariables from "./EnvironmentVariables";

const pool = new Pool({
  user: envVariables.DB_USER,
  host: envVariables.DB_HOST,
  database: envVariables.DB_NAME,
  password: envVariables.DB_PASSWORD,
  port: envVariables.DB_PORT
});

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
  searchquery = "SELECT * FROM {schema}.egov_pdf_gen WHERE";

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
  searchquery = `SELECT pdf_1.* FROM {schema}.egov_pdf_gen pdf_1 INNER JOIN (SELECT entityid, max(endtime) as MaxEndTime from (`+searchquery+`) as pdf_2 group by entityid) pdf_3 ON pdf_1.entityid = pdf_3.entityid AND pdf_1.endtime = pdf_3.MaxEndTime`;
  searchquery = replaceSchemaPlaceholder(searchquery, tenantId);
  
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
  let createJobKafkaTopic = envVariables.KAFKA_CREATE_JOB_TOPIC;
  if(envVariables.IS_ENVVIRONMENT_CENTRAL_INSTANCE)
    createJobKafkaTopic = getUpdatedTopic(tenantId, createJobKafkaTopic);

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

export const getUpdatedTopic = (tenantId, topic) => {
  let tenants = tenantId.split('.');
  if(tenants.length > 1)
    topic = tenants[1] + "-" + topic;
  console.log("The Kafka topic for the tenantId : " + tenantId + " is : " + topic);
  return topic;
};

export const replaceSchemaPlaceholder = (query, tenantId) => {
  let finalQuery = null;
	if (tenantId.includes('.')) {
		let schemaName = tenantId.split('.')[1];
		finalQuery = query.replace(/{schema}/g, schemaName);
	} else {
			finalQuery = query.replace(/{schema}./g, "");
	}
	return finalQuery;
};