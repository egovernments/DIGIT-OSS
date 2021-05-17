var express = require("express");
var router = express.Router();
var url = require("url");
var config = require("../config");

var {
  search_property,
  search_bill,
  search_payment,
  create_pdf,
  search_workflow,
} = require("../api");

const { asyncMiddleware } = require("../utils/asyncMiddleware");

function renderError(res, errorMessage, errorCode) {
  if (errorCode == undefined) errorCode = 500;
  res.status(errorCode).send({ errorMessage });
}

/* GET users listing. */
router.post(
  "/ptmutationcertificate",
  asyncMiddleware(async function (req, res, next) {
    var tenantId = req.query.tenantId;
    var uuid = req.query.uuid;
    var requestinfo = req.body;
    if (requestinfo == undefined) {
      return renderError(res, "requestinfo can not be null", 400);
    }
    if (!tenantId || !uuid) {
      return renderError(
        res,
        "tenantId and uuid are mandatory to generate the ptmutationcertificate",
        400
      );
    }

    try {
      try {
        resProperty = await search_property(uuid, tenantId, requestinfo);
      } catch (ex) {
        
        if (ex.response && ex.response.data) console.log(ex.response.data);
        return renderError(res, "Failed to query details of the property", 500);
      }
      var properties = resProperty.data;

      if (
        properties &&
        properties.Properties &&
        properties.Properties.length > 0
      ) {
        var creationReason = properties.Properties[0].creationReason;
        if (creationReason != "MUTATION")
          return renderError(
            res,
            "ptmutation certificate allowed only on mutation applications",
            400
          );
        try {
          var applicationNumber = properties.Properties[0].acknowldgementNumber;
          var workflowResponse = await search_workflow(
            applicationNumber,
            tenantId,
            requestinfo
          );
          var status = workflowResponse.data.ProcessInstances[0].state.state;
          if (status != "APPROVED")
            return renderError(
              res,
              `ptmutation certificate allowed only on Approved status, but current application status is ${status}`,
              400
            );
        } catch (ex) {
          
          if (ex.response && ex.response.data) console.log(ex.response.data);
          return renderError(
            res,
            "Failed to get status for property from workflow",
            500
          );
        }
        var pdfResponse;
        var pdfkey = config.pdf.ptmutationcertificate_pdf_template;
        try {
          pdfResponse = await create_pdf(
            tenantId,
            pdfkey,
            properties,
            requestinfo
          );
        } catch (ex) {
          
          if (ex.response && ex.response.data) console.log(ex.response.data);
          return renderError(res, "Failed to generate PDF for property", 500);
        }

        var filename = `${pdfkey}_${new Date().getTime()}`;

        //pdfData = pdfResponse.data.read();
        res.writeHead(200, {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename=${filename}.pdf`,
        });
        pdfResponse.data.pipe(res);
      } else {
        return renderError(
          res,
          "There is no property for you for this id",
          404
        );
      }
    } catch (ex) {
      return renderError(res, "Failed to query certificate details of the property", 500);
    }
  })
);

router.post(
  "/ptbill",
  asyncMiddleware(async function (req, res, next) {
    var tenantId = req.query.tenantId;
    var uuid = req.query.uuid;
    var requestinfo = req.body;
    if (requestinfo == undefined) {
      return renderError(res, "requestinfo can not be null", 400);
    }
    if (!tenantId || !uuid) {
      return renderError(
        res,
        "tenantId and uuid are mandatory to generate the ptbill",
        400
      );
    }
    try {
      try {
        resProperty = await search_property(uuid, tenantId, requestinfo, true);
      } catch (ex) {
        
        if (ex.response && ex.response.data) console.log(ex.response.data);
        return renderError(res, "Failed to query details of the property", 500);
      }
      var properties = resProperty.data;
      if (
        properties &&
        properties.Properties &&
        properties.Properties.length > 0
      ) {
        var propertyid = properties.Properties[0].propertyId;
        var billresponse;
        try {
          billresponse = await search_bill(propertyid, tenantId, requestinfo);
        } catch (ex) {
          
          if (ex.response && ex.response.data) console.log(ex.response.data);
          return renderError(res, `Failed to query bills for property`, 500);
        }
        var bills = billresponse.data;
        if (bills && bills.Bills && bills.Bills.length > 0) {
          var pdfResponse;
          var pdfkey = config.pdf.ptbill_pdf_template;
          try {
            var billArray = { Bill: bills.Bills };
            pdfResponse = await create_pdf(
              tenantId,
              pdfkey,
              billArray,
              requestinfo
            );
          } catch (ex) {
            
            if (ex.response && ex.response.data) console.log(ex.response.data);
            return renderError(res, "Failed to generate PDF for property", 500);
          }

          var filename = `${pdfkey}_${new Date().getTime()}`;

          //pdfData = pdfResponse.data.read();
          res.writeHead(200, {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=${filename}.pdf`,
          });
          pdfResponse.data.pipe(res);
        } else {
          return renderError(res, "There is no bill for this id", 404);
        }
      } else {
        return renderError(
          res,
          "There is no property for you for this id",
          404
        );
      }
    } catch (ex) {
      return renderError(res, "Failed to query bill details of the property", 500);
    }
  })
);

router.post(
  "/ptreceipt",
  asyncMiddleware(async function (req, res, next) {
    var tenantId = req.query.tenantId;
    var uuid = req.query.uuid;
    var requestinfo = req.body;
    if (requestinfo == undefined) {
      return renderError(res, "requestinfo can not be null", 400);
    }
    if (!tenantId || !uuid) {
      return renderError(
        res,
        "tenantId and uuid are mandatory to generate the ptreceipt",
        400
      );
    }
    try {
      try {
        resProperty = await search_property(uuid, tenantId, requestinfo);
      } catch (ex) {
        
        if (ex.response && ex.response.data) console.log(ex.response.data);
        return renderError(res, "Failed to query details of the property", 500);
      }
      var properties = resProperty.data;
      if (
        properties &&
        properties.Properties &&
        properties.Properties.length > 0
      ) {
        var propertyid = properties.Properties[0].propertyId;
        var bussinessService = "PT";
        var paymentresponse;
        try {
          paymentresponse = await search_payment(
            propertyid,
            tenantId,
            requestinfo,
            bussinessService
          );
        } catch (ex) {
          
          if (ex.response && ex.response.data) console.log(ex.response.data);
          return renderError(res, `Failed to query payment for property`, 500);
        }
        var payments = paymentresponse.data;
        if (payments && payments.Payments && payments.Payments.length > 0) {
          var pdfResponse;
          var pdfkey = config.pdf.ptreceipt_pdf_template;
          try {
            pdfResponse = await create_pdf(
              tenantId,
              pdfkey,
              payments,
              requestinfo
            );
          } catch (ex) {
            
            if (ex.response && ex.response.data) console.log(ex.response.data);
            return renderError(res, "Failed to generate PDF for property", 500);
          }

          var filename = `${pdfkey}_${new Date().getTime()}`;

          //pdfData = pdfResponse.data.read();
          res.writeHead(200, {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=${filename}.pdf`,
          });
          pdfResponse.data.pipe(res);
        } else {
          return renderError(res, "There is no payment for this id", 404);
        }
      } else {
        return renderError(
          res,
          "There is no property for you for this id",
          404
        );
      }
    } catch (ex) {
      return renderError(res, "Failed to query receipt details of the property", 500);
    }
  })
);

module.exports = router;
