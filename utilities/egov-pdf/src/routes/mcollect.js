var express = require("express");
var router = express.Router();
var config = require("../config");

var {
    search_echallan,
    search_billV2,
    search_bill_genie,
    create_pdf,
    compareAmount,
    search_payment_withReceiptNo,
  } = require("../api");

  const { asyncMiddleware } = require("../utils/asyncMiddleware");

  function renderError(res, errorMessage, errorCode) {
    if (errorCode == undefined) errorCode = 500;
    res.status(errorCode).send({ errorMessage });
  }

  router.post(
    "/mcollect-challan",
    asyncMiddleware(async function (req, res, next) {
      var tenantId = req.query.tenantId;
      var challanNo = req.query.challanNo;
      var requestinfo = req.body;
      if (requestinfo == undefined) {
        return renderError(res, "requestinfo can not be null", 400);
      }
      if (!tenantId || !challanNo) {
        return renderError(
          res,
          "tenantId and challanNo are mandatory to generate the mcollect-challan",
          400
        );
      }
      try {
        try {
          echallanDtls = await search_echallan(
            tenantId,
            challanNo,
            requestinfo
          );
        } catch (ex) {
          console.log("error",ex.stack);
          if (ex.response && ex.response.data) console.log(ex.response.data);
          return renderError(res, "Failed to query details of Challan", 500);
        }
        
        //console.log("data-",echallanDtls.data);
       // console.log("data-",JSON.stringify(echallanDtls.data.challans[0]));
        var echallans = echallanDtls.data;
        var challanObj;
        if (
          echallans &&
          echallans.challans &&
          echallans.challans.length > 0
        ) {
          challanObj = echallans.challans[0];
         if(challanObj.filestoreid)
          {
            respObj = {
              filestoreIds:[challanObj.filestoreid],
              ResponseInfo: requestinfo,
              key: config.pdf.mcollect_challan_template
            }
            //console.log("respObj--",respObj);
            var filename = `${pdfkey}_${new Date().getTime()}`;
            res.writeHead(200, {
              "Content-Type": "application/pdf",
              "Content-Disposition": `attachment; filename=${filename}.pdf`,
            }); 
           res.end(JSON.stringify(respObj));
          }
          else
          {
          var businessService = echallans.challans[0].businessService;
          var challanBill;
          try {
            challanBill = await search_billV2(
              tenantId,
              challanNo,
              businessService,
              requestinfo
            );
          } catch (ex) {
            
            if (ex.response && ex.response.data) console.log(ex.response.data);
            return renderError(
              res,
              `Failed to query bill for mcollect-challan`,
              500
            );
          }
          var challanBillDtl = challanBill.data;
          //console.log("challanBillDtl--",JSON.stringify(challanBillDtl));
          
          if (challanBillDtl && challanBillDtl.Bill && challanBillDtl.Bill.length > 0) {
            challanObj.totalAmount = challanBillDtl.Bill[0].totalAmount;
            challanObj.billNo = challanBillDtl.Bill[0].billNumber;
            challanObj.billDate = challanBillDtl.Bill[0].billDate;
            var sortedObj = challanBillDtl.Bill[0].billDetails[0].billAccountDetails;
            sortedObj.sort(compareAmount);
            challanObj.amount = sortedObj;
            challanObj.mobileNumber = challanObj.citizen.mobileNumber;
            challanObj.serviceType= challanObj.businessService.split(".")[0];
            //console.log("final obj--",challanObj);
            var finalObj = {Challan :challanObj};
            tenantId = tenantId.split('.')[0];
            var pdfResponse;
            var pdfkey = config.pdf.mcollect_challan_template;
            try {
              pdfResponse = await create_pdf(
                tenantId,
                pdfkey,
                finalObj,
                requestinfo
              );
            } catch (ex) {
             // 
             // if (ex.response && ex.response.data) console.log(ex.response.data);
              return renderError(
                res,
                "Failed to generate PDF for mcollect-challan receipt",
                500
              );
            }
            //console.log("pdfResponse--",pdfResponse);
            //console.log("pdfResponse--",pdfResponse.data);
            var filename = `${pdfkey}_${new Date().getTime()}`;
            res.writeHead(200, {
              "Content-Type": "application/pdf",
              "Content-Disposition": `attachment; filename=${filename}.pdf`,
            });
            pdfResponse.data.pipe(res);
          } else {
            return renderError(res, "There is no bill for this id", 404);
          } 
          
        }
        } else {
          return renderError(
            res,
            "There is no challan for you for this applicationNumber",
            404
          );
        }
       
      } catch (ex) {
        return renderError(res, "Failed to query details of Challan", 500);
      }
    })
  );


  router.post(
    "/mcollect-bill",
    asyncMiddleware(async function (req, res, next) {
      var tenantId = req.query.tenantId;
      var consumerCode = req.query.consumerCode;
      var requestinfo = req.body;
      if (requestinfo == undefined) {
        return renderError(res, "requestinfo can not be null", 400);
      }
      if (!tenantId || !consumerCode) {
        return renderError(
          res,
          "tenantId and consumerCode are mandatory to generate the mcollect-bill",
          400
        );
      }
      var inpData = {searchCriteria :{consumerCode : consumerCode , tenantId:tenantId}};
      try {
        try {
          echallanDtls = await search_bill_genie(
            inpData,
            requestinfo
          );
        } catch (ex) {
          console.log("error",ex.stack);
          if (ex.response && ex.response.data) console.log(ex.response.data);
          return renderError(res, "Failed to query details of bill genie", 500);
        }
        
        
        //console.log("data-",echallanDtls.data.Bills[0]);
        var echallansBill = echallanDtls.data;
        var challanObj;
         if (
          echallansBill &&
          echallansBill.Bills &&
          echallansBill.Bills.length > 0
        ) {
          var sortedObj = echallansBill.Bills[0].billDetails[0].billAccountDetails;
          sortedObj.sort(compareAmount);
          echallansBill.Bills[0].billDetails[0].billAccountDetails =  sortedObj;
          challanObj = echallansBill.Bills;
            //console.log("final obj--",challanObj);
            var finalObj = {Bill :challanObj};
            tenantId = tenantId.split('.')[0];
            var pdfResponse;
            var pdfkey = config.pdf.mcollect_bill_template;
            try {
              pdfResponse = await create_pdf(
                tenantId,
                pdfkey,
                finalObj,
                requestinfo
              );
            } catch (ex) {
              
              if (ex.response && ex.response.data) console.log(ex.response.data);
              return renderError(
                res,
                "Failed to generate PDF for mcollect bill",
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
         
       
      } catch (ex) {
        return renderError(res, "Failed to query bill details of Challan", 500);
      }
    })
  );



  module.exports = router;