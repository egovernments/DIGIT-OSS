var express = require("express");
var router = express.Router();
var url = require("url");
var config = require("../config");
var producer = require("../producer").producer ;
var logger = require("../logger").logger;
const uuidv4 = require("uuid/v4");
const { Pool } = require('pg');

const pool = new Pool({
  user: config.DB_USER,
  host: config.DB_HOST,
  database: config.DB_NAME,
  password: config.DB_PASSWORD,
  port: config.DB_PORT,
});

var {
  search_water,
  search_sewerage,
  search_waterOpenSearch,
  search_sewerageOpenSearch,
  search_bill_genie_water_bills,
  search_bill_genie_sewerage_bills,
  fetch_bill,
  search_billV2,
  search_payment,
  getPropertyDeatils,
  create_pdf
} = require("../api");

const { asyncMiddleware } = require("../utils/asyncMiddleware");

function renderError(res, errorMessage, errorCode) {
  if (errorCode == undefined) errorCode = 500;
  res.status(errorCode).send({ errorMessage });
}


router.post(
    "/wnsbill",
    asyncMiddleware(async function (req, res, next) {
      var tenantId = req.query.tenantId;
      var applicationNumber = req.query.applicationNumber;
      var bussinessService = req.query.bussinessService;
      var requestinfo = req.body;
      var restWns;
      if (requestinfo == undefined) {
        return renderError(res, "requestinfo can not be null");
      }
      if (!tenantId || !applicationNumber) {
        return renderError(
          res,
          "tenantId and applicationNumber are mandatory to generate the tlreceipt"
        );
      }
 
      try {
        try {
            if(bussinessService === 'WS' || bussinessService === 'WS.ONE_TIME_FEE'){
                restWns = await search_water(
                    applicationNumber,
                    tenantId,
                    {RequestInfo:requestinfo.RequestInfo},
                    true
                  );
            }
            else{
                restWns = await search_sewerage(
                    applicationNumber,
                    tenantId,
                    {RequestInfo:requestinfo.RequestInfo},
                    true
                  );
            }
          
        } catch (ex) {
          if (ex.response && ex.response.data) console.log(ex.response.data);
          return renderError(res, "Failed to query details of water and sewerage application");
        }

        var connection = restWns.data;
 
        if (
            connection &&
            connection.WaterConnection &&
            connection.WaterConnection.length > 0
        ) {
          var consumerCode = bussinessService == "WS"? connection.WaterConnection[0].connectionNo : connection.WaterConnection[0].applicationNo;
          var propertyId   = connection.WaterConnection[0].propertyId;
          var propertytoConsumerCodeMap = {};
          propertytoConsumerCodeMap[propertyId] = [consumerCode];
          var propertyDetails = await getPropertyDeatils({RequestInfo:requestinfo.RequestInfo}, tenantId, [propertyId], propertytoConsumerCodeMap);

          var billresponse;
          try {
            billresponse = await search_billV2(
              tenantId,
              consumerCode,
              bussinessService,
              {RequestInfo:requestinfo.RequestInfo}
            );
          } catch (ex) {
            if (ex.response && ex.response.data) console.log(ex.response.data);
            return renderError(res, `Failed to query bills for water application`);
          }
          
          var bills = billresponse.data;
          if (bills && bills.Bill && bills.Bill.length > 0) {
            let data = propertyDetails[consumerCode];
            bills.Bill[0].propertyUniqueId = data.propertyUniqueId;
            bills.Bill[0].propertyAddress = data.propertyAddress;
            bills.Bill[0].locality = data.locality;

            var pdfResponse;
            var pdfkey = config.pdf.wns_bill;
            try {
              var billArray = { Bill: bills.Bill };
              pdfResponse = await create_pdf(
                tenantId,
                pdfkey,
                billArray,
                {RequestInfo:requestinfo.RequestInfo}
              );
            } catch (ex) {
              let errorMessage;
              if(bussinessService == 'WS')
                errorMessage = "Failed to generate PDF for water connection bill";
              if(bussinessService == 'WS.ONE_TIME_FEE')
                errorMessage = "Failed to generate PDF for water one time fees bill"; 

              if (ex.response && ex.response.data) console.log(ex.response.data);
              return renderError(
                res,
                errorMessage
              );
            }
            var filename = `${pdfkey}_${new Date().getTime()}`;
            res.writeHead(200, {
              "Content-Type": "application/pdf",
              "Content-Disposition": `attachment; filename=${filename}.pdf`,
            });
            pdfResponse.data.pipe(res);
          } else {
            return renderError(res, "There is no bill for this application number");
          }
        }
        else if (
            connection &&
            connection.SewerageConnections &&
            connection.SewerageConnections.length > 0
        ) {
            var consumerCode = bussinessService == "SW"? connection.SewerageConnections[0].connectionNo : connection.SewerageConnections[0].applicationNo;
            var propertyId   = connection.SewerageConnections[0].propertyId;
            var propertytoConsumerCodeMap = {};
            propertytoConsumerCodeMap[propertyId] = [consumerCode];
            var propertyDetails = await getPropertyDeatils({RequestInfo:requestinfo.RequestInfo}, tenantId, [propertyId], propertytoConsumerCodeMap);
  
            var billresponse;
          try {
            billresponse = await search_billV2(
              tenantId,
              consumerCode,
              bussinessService,
              {RequestInfo:requestinfo.RequestInfo}
            );
          } catch (ex) {
            if (ex.response && ex.response.data) console.log(ex.response.data);
            return renderError(res, `Failed to query bills for sewerage application`);
          }
          
          var bills = billresponse.data;
          if (bills && bills.Bill && bills.Bill.length > 0) {
            let data = propertyDetails[consumerCode];
            bills.Bill[0].propertyUniqueId = data.propertyUniqueId;
            bills.Bill[0].propertyAddress = data.propertyAddress;
            bills.Bill[0].locality = data.locality;
            
            var pdfResponse;
            var pdfkey = config.pdf.wns_bill;
            try {
              var billArray = { Bill: bills.Bill };
              pdfResponse = await create_pdf(
                tenantId,
                pdfkey,
                billArray,
                {RequestInfo:requestinfo.RequestInfo}
              );
            } catch (ex) {
              let errorMessage;
              if(bussinessService == 'SW')
                errorMessage = "Failed to generate PDF for sewerage connection bill";
              if(bussinessService == 'SW.ONE_TIME_FEE')
                errorMessage = "Failed to generate PDF for sewerage one time fees bill"; 

              if (ex.response && ex.response.data) console.log(ex.response.data);
              return renderError(
                res,
                errorMessage
              );
            }
            var filename = `${pdfkey}_${new Date().getTime()}`;
            res.writeHead(200, {
              "Content-Type": "application/pdf",
              "Content-Disposition": `attachment; filename=${filename}.pdf`,
            });
            pdfResponse.data.pipe(res);
          } else {
            return renderError(res, "There is no bill for this application number");
          }
        }
        else {
          return renderError(
            res,
            "There is no water and sewerage applicaion for this applicationNumber"
          );
        }
      } catch (ex) {
        return renderError(res, `Failed to query bill for water and sewerage application`);
      }
    })
  );

  router.post(
    "/wnsreceipt",
    asyncMiddleware(async function (req, res, next) {
      var tenantId = req.query.tenantId;
      var applicationNumber = req.query.applicationNumber;
      var bussinessService = req.query.bussinessService;
      var requestinfo = req.body;
      var restWns;
      if (requestinfo == undefined) {
        return renderError(res, "requestinfo can not be null");
      }
      if (!tenantId || !applicationNumber) {
        return renderError(
          res,
          "tenantId and applicationNumber are mandatory to generate the tlreceipt"
        );
      }
 
      try {
        try {
            if(bussinessService === 'WS' || bussinessService === 'WS.ONE_TIME_FEE'){
                restWns = await search_water(
                    applicationNumber,
                    tenantId,
                    {RequestInfo:requestinfo.RequestInfo},
                    false
                  );
            }
            else{
                restWns = await search_sewerage(
                    applicationNumber,
                    tenantId,
                    {RequestInfo:requestinfo.RequestInfo},
                    false
                  );
            }
          
        } catch (ex) {
          if (ex.response && ex.response.data) console.log(ex.response.data);
          return renderError(res, "Failed to query details of water and sewerage application");
        }
        var connection = restWns.data;
 
        if (
            connection &&
            connection.WaterConnection &&
            connection.WaterConnection.length > 0
        ) {
          var consumerCode = bussinessService == "WS"? connection.WaterConnection[0].connectionNo : connection.WaterConnection[0].applicationNo;
          var paymentresponse;
          try {
            paymentresponse = await search_payment(
                consumerCode,
                tenantId,
                {RequestInfo:requestinfo.RequestInfo},
                bussinessService
              );
          } catch (ex) {
            if (ex.response && ex.response.data) console.log(ex.response.data);
            return renderError(res, `Failed to query receipt for water application`);
          }
          
          var payments = paymentresponse.data;
          if (payments && payments.Payments && payments.Payments.length > 0) {
            var pdfResponse;
            var pdfkey = config.pdf.wns_one_time_receipt;
            try {
              pdfResponse = await create_pdf(
                tenantId,
                pdfkey,
                payments,
                {RequestInfo:requestinfo.RequestInfo}
              );
            } catch (ex) {
              let errorMessage;
              if(bussinessService == 'WS')
                errorMessage = "Failed to generate PDF for water connection receipt";
              if(bussinessService == 'WS.ONE_TIME_FEE')
                errorMessage = "Failed to generate PDF for water one time fees receipt"; 

              if (ex.response && ex.response.data) console.log(ex.response.data);
              return renderError(
                res,
                errorMessage
              );
            }
            var filename = `${pdfkey}_${new Date().getTime()}`;
            res.writeHead(200, {
              "Content-Type": "application/pdf",
              "Content-Disposition": `attachment; filename=${filename}.pdf`,
            });
            pdfResponse.data.pipe(res);
          } else {
            return renderError(res, "There is no receipt for this application number");
          }
        }
        else if (
            connection &&
            connection.SewerageConnections &&
            connection.SewerageConnections.length > 0
        ) {
            var consumerCode = bussinessService == "SW"? connection.SewerageConnections[0].connectionNo : connection.SewerageConnections[0].applicationNo;
            var paymentresponse;
          try {
            paymentresponse = await search_payment(
                consumerCode,
                tenantId,
                {RequestInfo:requestinfo.RequestInfo},
                bussinessService
              );
          } catch (ex) {
            if (ex.response && ex.response.data) console.log(ex.response.data);
            return renderError(res, `Failed to query receipt for sewerage application`);
          }
          
          var payments = paymentresponse.data;
          if (payments && payments.Payments && payments.Payments.length > 0) {
            var pdfResponse;
            var pdfkey = config.pdf.wns_one_time_receipt;
            try {
              pdfResponse = await create_pdf(
                tenantId,
                pdfkey,
                payments,
                {RequestInfo:requestinfo.RequestInfo}
              );
            } catch (ex) {
              let errorMessage;
              if(bussinessService == 'SW')
                errorMessage = "Failed to generate PDF for sewerage connection receipt";
              if(bussinessService == 'SW.ONE_TIME_FEE')
                errorMessage = "Failed to generate PDF for sewerage one time fees receipt"; 

              if (ex.response && ex.response.data) console.log(ex.response.data);
              return renderError(
                res,
                errorMessage
              );
            }
            var filename = `${pdfkey}_${new Date().getTime()}`;
            res.writeHead(200, {
              "Content-Type": "application/pdf",
              "Content-Disposition": `attachment; filename=${filename}.pdf`,
            });
            pdfResponse.data.pipe(res);
          } else {
            return renderError(res, "There is no receipt for this application number");
          }
        }
        else {
          return renderError(
            res,
            "There is no water and sewerage applicaion for this applicationNumber"
          );
        }
      } catch (ex) {
        return renderError(res, `Failed to query receipt for water and sewerage application`);
      }
    })
  );  

  router.post(
    "/wnsgroupbill",
    asyncMiddleware(async function (req, res, next) {
      var tenantId = req.query.tenantId;
      var locality = req.query.locality;
      var bussinessService = req.query.bussinessService;
      var isConsolidated = (req.query.isConsolidated != undefined && req.query.isConsolidated.toLowerCase() === 'true' ? true : false)
      var consumerCode = null;
      if(req.query.consumerCode)
        consumerCode = req.query.consumerCode;
      var requestinfo = req.body;
      
      if (requestinfo == undefined) {
        return renderError(res, "requestinfo can not be null");
      }
      if (!tenantId || !locality || !bussinessService) {
        return renderError(
          res,
          "Bussiness Service, TenantId and Locality are mandatory to generate the water and sewerage bill"
        );
      }

      var id = uuidv4();
      var jobid = `${config.pdf.wns_bill}-${new Date().getTime()}-${id}`;

      var kafkaData = {
        requestinfo: requestinfo,
        tenantId: tenantId,
        locality: locality,
        bussinessService: bussinessService,
        isConsolidated: isConsolidated,
        consumerCode: consumerCode,
        jobid: jobid
      };

      try {
        var payloads = [];
        payloads.push({
          topic: config.KAFKA_BULK_PDF_TOPIC,
          messages: JSON.stringify(kafkaData)
        });
        producer.send(payloads, function(err, data) {
          if (err) {
            logger.error(err.stack || err);
            errorCallback({
              message: `error while publishing to kafka: ${err.message}`
            });
          } else {
            logger.info("jobid: " + jobid + ": published to kafka successfully");
          }
        });

        try {
          const result = await pool.query('select * from egov_bulk_pdf_info where jobid = $1', [jobid]);
          if(result.rowCount<1){
            var userid = requestinfo.RequestInfo.userInfo.uuid;
            const insertQuery = 'INSERT INTO egov_bulk_pdf_info(jobid, uuid, recordscompleted, totalrecords, createdtime, filestoreid, lastmodifiedby, lastmodifiedtime, tenantid, locality, businessservice, consumercode, isconsolidated, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)';
            const curentTimeStamp = new Date().getTime();
            const status = 'INPROGRESS';
            await pool.query(insertQuery,[jobid, userid, 0, 0, curentTimeStamp, null, userid, curentTimeStamp, tenantId, locality, bussinessService, consumerCode, isConsolidated, status]);
          }
        } catch (err) {
          logger.error(err.stack || err);
        } 

        res.status(201);
        res.json({
          ResponseInfo: requestinfo.RequestInfo,
          jobId:jobid,
          message: "Bulk pdf creation is in process",
        });
        
      } catch (error) {
        return renderError(res, `Failed to query bill for water and sewerage application`);
      }

    })
  );


module.exports = router;
