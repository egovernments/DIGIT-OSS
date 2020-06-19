var express = require("express");
var router = express.Router();
var url = require("url");
var config = require("../config");

var {
  search_bill,
  search_payment,
  search_tllicense,
  create_pdf,
} = require("../api");

const { asyncMiddleware } = require("../utils/asyncMiddleware");

function renderError(res, errorMessage, errorCode) {
  if (errorCode == undefined) errorCode = 500;
  res.status(errorCode).send({ errorMessage });
}

router.post(
  "/tlreceipt",
  asyncMiddleware(async function (req, res, next) {
    var tenantId = req.query.tenantId;
    var applicationNumber = req.query.applicationNumber;
    var requestinfo = req.body;
    if (requestinfo == undefined) {
      return renderError(res, "requestinfo can not be null", 400);
    }
    if (!tenantId || !applicationNumber) {
      return renderError(
        res,
        "tenantId and applicationNumber are mandatory to generate the tlreceipt",
        400
      );
    }
    try {
      try {
        restradelicense = await search_tllicense(
          applicationNumber,
          tenantId,
          requestinfo
        );
      } catch (ex) {
        console.log(ex.stack);
        if (ex.response && ex.response.data) console.log(ex.response.data);
        return renderError(res, "Failed to query details of tradelicense", 500);
      }
      var tradelicenses = restradelicense.data;

      if (
        tradelicenses &&
        tradelicenses.Licenses &&
        tradelicenses.Licenses.length > 0
      ) {
        var applicationNumber = tradelicenses.Licenses[0].applicationNumber;
        var paymentresponse;
        try {
          paymentresponse = await search_payment(
            applicationNumber,
            tenantId,
            requestinfo
          );
        } catch (ex) {
          console.log(ex.stack);
          if (ex.response && ex.response.data) console.log(ex.response.data);
          return renderError(
            res,
            `Failed to query payment for tradelicense`,
            500
          );
        }
        var payments = paymentresponse.data;
        if (payments && payments.Payments && payments.Payments.length > 0) {
          var pdfResponse;
          var pdfkey = config.pdf.tlreceipt_pdf_template;
          try {
            pdfResponse = await create_pdf(
              tenantId,
              pdfkey,
              payments,
              requestinfo
            );
          } catch (ex) {
            console.log(ex.stack);
            if (ex.response && ex.response.data) console.log(ex.response.data);
            return renderError(
              res,
              "Failed to generate PDF for tradelicense receipt",
              500
            );
          }
          var filename = `${pdfkey}_${new Date().getTime()}`;
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
          "There is no tradelicense for you for this applicationNumber",
          404
        );
      }
    } catch (ex) {
      console.log(ex.stack);
    }
  })
);

router.post(
  "/tlcertificate",
  asyncMiddleware(async function (req, res, next) {
    var tenantId = req.query.tenantId;
    var applicationNumber = req.query.applicationNumber;
    var requestinfo = req.body;
    if (requestinfo == undefined) {
      return renderError(res, "requestinfo can not be null", 400);
    }
    if (!tenantId || !applicationNumber) {
      return renderError(
        res,
        "tenantId and applicationNumber are mandatory to generate the tlcertificate",
        400
      );
    }

    try {
      try {
        restradelicense = await search_tllicense(
          applicationNumber,
          tenantId,
          requestinfo
        );
      } catch (ex) {
        console.log(ex.stack);
        if (ex.response && ex.response.data) console.log(ex.response.data);
        return renderError(res, "Failed to query details of tradelicense", 500);
      }
      var tradelicenses = restradelicense.data;

      if (
        tradelicenses &&
        tradelicenses.Licenses &&
        tradelicenses.Licenses.length > 0
      ) {
        var pdfResponse;
        var pdfkey = config.pdf.tlcertificate_pdf_template;
        var status = tradelicenses.Licenses[0].status;
        if (status != "APPROVED")
          return renderError(
            res,
            `tlcertificate allowed only on Approved status, but current application status is ${status}`,
            400
          );
        try {
          pdfResponse = await create_pdf(
            tenantId,
            pdfkey,
            tradelicenses,
            requestinfo
          );
        } catch (ex) {
          console.log(ex.stack);
          if (ex.response && ex.response.data) console.log(ex.response.data);
          return renderError(
            res,
            "Failed to generate PDF for tradelicense",
            500
          );
        }
        var filename = `${pdfkey}_${new Date().getTime()}`;
        res.writeHead(200, {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename=${filename}.pdf`,
        });
        pdfResponse.data.pipe(res);
      } else {
        return renderError(
          res,
          "There is no tradelicense for you for this applicationNumber",
          404
        );
      }
    } catch (ex) {
      console.log(ex.stack);
    }
  })
);

router.post(
  "/tlrenewalcertificate",
  asyncMiddleware(async function (req, res, next) {
    var tenantId = req.query.tenantId;
    var applicationNumber = req.query.applicationNumber;
    var requestinfo = req.body;
    if (requestinfo == undefined) {
      return renderError(res, "requestinfo can not be null", 400);
    }
    if (!tenantId || !applicationNumber) {
      return renderError(
        res,
        "tenantId and applicationNumber are mandatory to generate the tlrenewalcertificate",
        400
      );
    }

    try {
      try {
        restradelicense = await search_tllicense(
          applicationNumber,
          tenantId,
          requestinfo
        );
      } catch (ex) {
        console.log(ex.stack);
        if (ex.response && ex.response.data) console.log(ex.response.data);
        return renderError(res, "Failed to query details of tradelicense", 500);
      }
      var tradelicenses = restradelicense.data;

      if (
        tradelicenses &&
        tradelicenses.Licenses &&
        tradelicenses.Licenses.length > 0
      ) {
        var pdfResponse;
        var pdfkey = config.pdf.tlrenewalcertificate_pdf_template;
        var status = tradelicenses.Licenses[0].status;
        var applicationType = tradelicenses.Licenses[0].applicationType;
        if (applicationType != "RENEWAL")
          return renderError(
            res,
            `tlrenewalcertificate allowed only on renewal applications`,
            400
          );
        if (status != "APPROVED")
          return renderError(
            res,
            `tlrenewalcertificate allowed only on Approved status, but current application status is ${status}`,
            400
          );
        try {
          pdfResponse = await create_pdf(
            tenantId,
            pdfkey,
            tradelicenses,
            requestinfo
          );
        } catch (ex) {
          console.log(ex.stack);
          if (ex.response && ex.response.data) console.log(ex.response.data);
          return renderError(
            res,
            "Failed to generate PDF for tradelicense",
            500
          );
        }
        var filename = `${pdfkey}_${new Date().getTime()}`;
        res.writeHead(200, {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename=${filename}.pdf`,
        });
        pdfResponse.data.pipe(res);
      } else {
        return renderError(
          res,
          "There is no tradelicense for you for this applicationNumber",
          404
        );
      }
    } catch (ex) {
      console.log(ex.stack);
    }
  })
);

// router.post(
//   "/tlbill",
//   asyncMiddleware(async function (req, res, next) {
//     var tenantId = req.query.tenantId;
//     var applicationNumber = req.query.applicationNumber;
//     var requestinfo = req.body;
//     if (requestinfo == undefined) {
//       return renderError(res, "requestinfo can not be null");
//     }
//     if (!tenantId || !applicationNumber) {
//       return renderError(
//         res,
//         "tenantId and applicationNumber are mandatory to generate the tlreceipt"
//       );
//     }

//     try {
//       try {
//         restradelicense = await search_tllicense(
//           applicationNumber,
//           tenantId,
//           requestinfo
//         );
//       } catch (ex) {
//         console.log(ex.stack);
//         if (ex.response && ex.response.data) console.log(ex.response.data);
//         return renderError(res, "Failed to query details of tradelicense");
//       }
//       var tradelicenses = restradelicense.data;

//       if (
//         tradelicenses &&
//         tradelicenses.Licenses &&
//         tradelicenses.Licenses.length > 0
//       ) {
//         var applicationNumber = tradelicenses.Licenses[0].applicationNumber;
//         var billresponse;
//         try {
//           billresponse = await search_bill(
//             applicationNumber,
//             tenantId,
//             requestinfo
//           );
//         } catch (ex) {
//           console.log(ex.stack);
//           if (ex.response && ex.response.data) console.log(ex.response.data);
//           return renderError(res, `Failed to query bills for tradelicense`);
//         }
//         var bills = billresponse.data;
//         if (bills && bills.Bills && bills.Bills.length > 0) {
//           var pdfResponse;
//           var pdfkey = config.pdf.tlbill_pdf_template;
//           try {
//             var billArray = { Bill: bills.Bills };
//             pdfResponse = await create_pdf(
//               tenantId,
//               pdfkey,
//               billArray,
//               requestinfo
//             );
//           } catch (ex) {
//             console.log(ex.stack);
//             if (ex.response && ex.response.data) console.log(ex.response.data);
//             return renderError(
//               res,
//               "Failed to generate PDF for tradelicense bill"
//             );
//           }
//           var filename = `${pdfkey}_${new Date().getTime()}`;
//           res.writeHead(200, {
//             "Content-Type": "application/pdf",
//             "Content-Disposition": `attachment; filename=${filename}.pdf`,
//           });
//           pdfResponse.data.pipe(res);
//         } else {
//           return renderError(res, "There is no bill for this id");
//         }
//       } else {
//         return renderError(
//           res,
//           "There is no tradelicense for this applicationNumber"
//         );
//       }
//     } catch (ex) {
//       console.log(ex.stack);
//     }
//   })
// );

module.exports = router;
