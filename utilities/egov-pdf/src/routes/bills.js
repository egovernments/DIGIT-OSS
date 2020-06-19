// var express = require("express");
// var router = express.Router();
// var url = require("url");
// var config = require("../config");

// var { search_bill, create_pdf } = require("../api");

// const { asyncMiddleware } = require("../utils/asyncMiddleware");

// function renderError(res, errorMessage) {
//   res.render("error-message", { message: errorMessage });
// }

// /* GET users listing. */
// router.post(
//   "/consolidatedbill",
//   asyncMiddleware(async function (req, res, next) {
//     var tenantId = req.query.tenantId;
//     var consumerCode = req.query.consumerCode;
//     var requestinfo = req.body;
//     if (requestinfo == undefined) {
//       return renderError(res, "requestinfo can not be null");
//     }
//     if (!tenantId || !consumerCode) {
//       return renderError(
//         res,
//         "tenantId and consumerCode are mandatory to generate the bill"
//       );
//     }
//     try {
//       var resBill;
//       try {
//         resBill = await search_bill(consumerCode, tenantId, requestinfo);
//       } catch (ex) {
//         console.log(ex.stack);
//         if (ex.response && ex.response.data) console.log(ex.response.data);
//         return renderError(res, "Failed to query details of the bill");
//       }
//       var bills = resBill.data;
//       var pdfkey = config.pdf.consolidated_bill_template;
//       if (bills && bills.Bills && bills.Bills.length > 0) {
//         var pdfResponse;
//         try {
//           var billArray = { Bill: bills.Bills };
//           pdfResponse = await create_pdf(
//             tenantId,
//             pdfkey,
//             billArray,
//             requestinfo
//           );
//         } catch (ex) {
//           console.log(ex.stack);
//           if (ex.response && ex.response.data) console.log(ex.response.data);
//           return renderError(res, "Failed to generate PDF for the bill");
//         }
//         var filename = `${pdfkey}_${new Date().getTime()}`;
//         res.writeHead(200, {
//           "Content-Type": "application/pdf",
//           "Content-Disposition": `attachment; filename=${filename}.pdf`,
//         });
//         pdfResponse.data.pipe(res);
//       } else {
//         return renderError(res, "There is no bill for this code");
//       }
//     } catch (ex) {
//       console.log(ex.stack);
//     }
//   })
// );

// module.exports = router;
