var express = require("express");
var router = express.Router();
 var url = require("url");
 var config = require("../config");

 var { search_billV2, search_amendment, create_pdf } = require("../api");

 const { asyncMiddleware } = require("../utils/asyncMiddleware");

 function renderError(res, errorMessage) {
   res.render("error-message", { message: errorMessage });
 }

 /* GET users listing. */
 router.post(
   "/consolidatedbill",
   asyncMiddleware(async function (req, res, next) {
     var tenantId = req.query.tenantId;
     var consumerCode = req.query.consumerCode;
     var bussinessService = req.query.bussinessService;
     var requestinfo = req.body;
     if (requestinfo == undefined) {
       return renderError(res, "requestinfo can not be null");
     }
     if (!tenantId || !consumerCode) {
       return renderError(
         res,
         "tenantId and consumerCode are mandatory to generate the bill"
       );
     }
     try {
       var resBill;
       try {
         resBill = await search_billV2(tenantId, consumerCode, bussinessService, requestinfo);
       } catch (ex) {
         
         if (ex.response && ex.response.data) console.log(ex.response.data);
         return renderError(res, "Failed to query details of the bill");
       }
       var bills = resBill.data;
       var pdfkey = config.pdf.consolidated_bill_template;

       if (bills && bills.Bill && bills.Bill.length > 0) {
         var pdfResponse;
         try {
           var billArray = { Bill: bills.Bill };
           pdfResponse = await create_pdf(
             tenantId,
             pdfkey,
             billArray,
             requestinfo
           );
         } catch (ex) {
           
           if (ex.response && ex.response.data) console.log(ex.response.data);
           return renderError(res, "Failed to generate PDF for the bill");
         }
         
         var filename = `${pdfkey}_${new Date().getTime()}`;
         res.writeHead(200, {
           "Content-Type": "application/pdf",
           "Content-Disposition": `attachment; filename=${filename}.pdf`,
         });
         pdfResponse.data.pipe(res);
       } else {
         return renderError(res, "There is no bill for this code");
       }
     } catch (ex) {
      return renderError(res, "Failed to query details of the bill");
    }
   })
 );

 router.post(
    "/billamendmentcertificate",
    asyncMiddleware(async function (req, res, next) {
      var tenantId = req.query.tenantId;
      var amendmentId = req.query.amendmentId;
      var bussinessService = req.query.bussinessService;
      var requestinfo = req.body;

      if (requestinfo == undefined) {
        return renderError(res, "requestinfo can not be null");
      }
      if (!tenantId || !amendmentId) {
        return renderError(
          res,
          "tenantId and amendmentId are mandatory to generate the bill"
        );
      }
      try {
        var billAmendment;
        try {
          billAmendment = await search_amendment(tenantId, amendmentId, bussinessService, requestinfo);
        } catch (ex) {
          
          if (ex.response && ex.response.data) console.log(ex.response.data);
          return renderError(res, "Failed to query details of the bill amendment");
        }
        var amendment = billAmendment.data;
        var pdfkey = config.pdf.bill_amendment_template;
 
        if (amendment && amendment.Amendments && amendment.Amendments.length > 0) {
          var pdfResponse;
          try {
            var Amendments = { Amendments: amendment.Amendments };
            pdfResponse = await create_pdf(
              tenantId,
              pdfkey,
              Amendments,
              requestinfo
            );
          } catch (ex) {
            
            if (ex.response && ex.response.data) console.log(ex.response.data);
            return renderError(res, "Failed to generate PDF for the bill amendment");
          }
          
          var filename = `${pdfkey}_${new Date().getTime()}`;
          res.writeHead(200, {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=${filename}.pdf`,
          });
          pdfResponse.data.pipe(res);
        } else {
          return renderError(res, "There is no bill amendment for this amendment id");
        }
      } catch (ex) {
        return renderError(res, "Failed to query details of the bill amendment");
      }
    })
  );

 module.exports = router;
