
var express = require('express');
var router = express.Router();
var url = require("url");
var config = require("../config");

var {search_epass, search_mdms, search_user, create_pdf} = require("../api")

const {
  asyncMiddleware
} = require('../utils/asyncMiddleware');


function renderError(res, errorMessage) {
  res.render('error-message', {message: errorMessage})
}

/* GET users listing. */
router.get('/', asyncMiddleware(async function(req, res, next) {
  var tenantId = req.query.tenantId;
  var uuid = req.query.uuid;
  var hash = req.query.hash;

  if (!tenantId || !uuid) {
    return renderError(res,"tenantId and uuid are mandatory to generate the pass")
  }

  try {
    var resPass 
    try {
      resPass = await search_epass(uuid, tenantId);
    } catch (ex) {
      
      if (ex.response && ex.response.data)
          console.log(ex.response.data);
      return renderError(res, "Failed to query details of the pass");
    }
    var passes = resPass.data;

    if (passes && passes.Licenses && passes.Licenses.length > 0) {
      var license = passes.Licenses[0]
      var approverUuid = license.auditDetails.lastModifiedBy;

      // var approverRes = await search_user(approverUuid);
      // var approver = approverRes.data;
      if (license.status != "APPROVED") {
        return renderError(res, "This pass has not yet been approved");
      }

      license.tradeLicenseDetail.additionalDetail = Object.assign(license.tradeLicenseDetail.additionalDetail, {
        qrcode: url.resolve(config.app.host, config.app.contextPath + config.paths.download_url) + `?uuid=${uuid}&tenantId=${tenantId}`
      })
      
      var pdfResponse;
      try{
        pdfResponse = await create_pdf(tenantId, config.pdf.epass_pdf_template, passes);
      } catch (ex) {
        
        if (ex.response && ex.response.data)
          console.log(ex.response.data);
      return renderError(res, "Failed to generate PDF for the pass");
      }

      var applicationNo = license.applicationNumber;

      //pdfData = pdfResponse.data.read();
      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=${applicationNo}-epass.pdf`,
      });
      pdfResponse.data.pipe(res);
    } else {
      
      return renderError(res, "There is no pass for this id");
    }
  } catch  (ex) {
    return renderError(res, "Failed to query details of the pass");
  }
}));

module.exports = router;
