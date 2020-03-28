
var express = require('express');
var router = express.Router();
var url = require("url");
var config = require("../config");

var {search_epass, search_mdms, search_user, create_pdf} = require("../api")

const {
  asyncMiddleware
} = require('../utils/asyncMiddleware');


/* GET users listing. */
router.get('/', asyncMiddleware(async function(req, res, next) {
  var tenantId = req.query.tenantId;
  var uuid = req.query.uuid;
  var hash = req.query.hash;

  try {
    var resPass = await search_epass(uuid, tenantId);
    var passes = resPass.data;

    if (passes && passes.Licenses && passes.Licenses.length > 0) {
      var license = passes.Licenses[0]
      var approverUuid = license.auditDetails.lastModifiedBy;

      var approverRes = await search_user(approverUuid);
      var approver = approverRes.data;
      
      license.tradeLicenseDetail.additionalDetail = Object.assign(license.tradeLicenseDetail.additionalDetail, {
        qrcode: url.resolve(config.app.host, config.app.contextPath + config.paths.download_url) + `?uuid=${uuid}&tenantId=${tenantId}`
      })
      
      var pdfResponse = await create_pdf(tenantId, config.pdf.epass_pdf_template, passes);
      var applicationNo = license.applicationNumber;

      //pdfData = pdfResponse.data.read();
      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=${applicationNo}-epass.pdf`,
      });
      pdfResponse.data.pipe(res);
    } else {
      // failed to get license
    }
  } catch  (ex) {
    console.log(ex);
  }
}));

module.exports = router;
