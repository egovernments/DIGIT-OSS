var express = require("express");
var router = express.Router();
var url = require("url");
var config = require("../config");

var { search_payment, create_pdf } = require("../api");

const { asyncMiddleware } = require("../utils/asyncMiddleware");

function renderError(res, errorMessage, errorCode) {
  if (errorCode == undefined) errorCode = 500;
  res.status(errorCode).send({ errorMessage });
}

/* GET users listing. */
router.post(
  "/consolidatedreceipt",
  asyncMiddleware(async function (req, res, next) {
    var tenantId = req.query.tenantId;
    var consumerCode = req.query.consumerCode;
    var bussinessService = req.query.bussinessService;
    var receiptKey = req.query.pdfKey;
    var receiptNumbers = req.query.receiptNumbers;
    var requestinfo = req.body;
    if (requestinfo == undefined) {
      return renderError(res, "requestinfo can not be null", 400);
    }
    if (!tenantId) {
      return renderError(
        res,
        "tenantId is mandatory to generate the receipt",
        400
      );
    }
    else if (!receiptNumbers && !consumerCode) {
      return renderError(
        res,
        "consumerCode or receiptNumbers are mandatory to generate the receipt",
        400
      );
    }

    try {
      try {
        resProperty = await search_payment(consumerCode, tenantId, requestinfo, bussinessService, receiptNumbers);
      } catch (ex) {
        
        if (ex.response && ex.response.data) console.log(ex.response.data);
        return renderError(res, "Failed to query details of the payment", 500);
      }
      var payments = resProperty.data;
      if (payments && payments.Payments && payments.Payments.length > 0) {
        var pdfResponse;
        var pdfkey = receiptKey || config.pdf.consolidated_receipt_template;
        try {
          pdfResponse = await create_pdf(
            tenantId,
            pdfkey,
            payments,
            requestinfo
          );
        } catch (ex) {
          
          if (ex.response && ex.response.data) console.log(ex.response.data);
          return renderError(res, "Failed to generate PDF for payment", 500);
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
          "There is no payment done by you for this id",
          404
        );
      }
    } catch (ex) {
      return renderError(res, "Failed to query details of the payment", 500);
    }
  })
);

module.exports = router;
