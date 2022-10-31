const { createProxyMiddleware } = require("http-proxy-middleware");

const createProxy = createProxyMiddleware({
  //target: process.env.REACT_APP_PROXY_API || "https://uat.digit.org",
  // target: process.env.REACT_APP_PROXY_API || "https://qa.digit.org",
  target: process.env.REACT_APP_PROXY_API || "http://10.1.1.18:8443",
  changeOrigin: true,
});
const assetsProxy = createProxyMiddleware({
  target: process.env.REACT_APP_PROXY_ASSETS || "http://10.1.1.18:8443",
  changeOrigin: true,
});
const apiSetuProxy = createProxyMiddleware({
  target: process.env.REACT_APP_PROXY_SETU || "https://apisetu.gov.in",
  changeOrigin: true,
});
const LicProxy = createProxyMiddleware({
  target: process.env.REACT_APP_PROXY_MDMS || "http://10.1.1.18:8443",
  changeOrigin: true,
});
const docUploadProxy = createProxyMiddleware({
  target: process.env.REACT_APP_PROXY_UPLOAD_DOC || "http://10.1.1.18:8443",
  changeOrigin: true,
});
const devRegistration = createProxyMiddleware({
  target: process.env.REACT_APP_PROXY_DEV_REG || "http://10.1.1.18:8443",
  changeOrigin: true,
});
module.exports = function (app) {
  [
    "/egov-mdms-service",
    "/egov-location",
    "/localization",
    "/egov-workflow-v2",
    "/pgr-services",
    "/filestore",
    "/egov-hrms",
    "/user-otp",
    "/user",
    "/fsm",
    "/billing-service",
    "/collection-services",
    "/pdf-service",
    "/pg-service",
    "/vehicle",
    "/vendor",
    "/property-services",
    "/fsm-calculator/v1/billingSlab/_search",
    "/pt-calculator-v2",
    "/dashboard-analytics",
    "/echallan-services",
    "/egov-searcher/bill-genie/mcollectbills/_get",
    "/egov-searcher/bill-genie/billswithaddranduser/_get",
    "/egov-pdf/download/UC/mcollect-challan",
    "/egov-hrms/employees/_count",
    "/tl-services/v1/_create",
    "/tl-services/v1/_search",
    "/egov-url-shortening/shortener",
    "/inbox/v1/_search",
    "/tl-services",
    "/tl-calculator",
    "/edcr",
    "/bpa-services",
    "/noc-services",
    "/egov-user-event",
    "/egov-document-uploader",
    "/egov-pdf",
    "/egov-survey-services",
    "/ws-services",
    "/sw-services",
  ].forEach((location) => app.use(location, createProxy));
  ["/pb-egov-assets"].forEach((location) => app.use(location, assetsProxy));
  [
    "/mca/v1/companies",
    "/mca-directors/v1/companies",
    "/certificate/v3/pan/pancr"
  ].forEach((location) => app.use(location, apiSetuProxy));
  ["/egov-mdms-service/v1"].forEach((location) => app.use(location, LicProxy));
  ["/filestore/v1"].forEach((location) => app.use(location, docUploadProxy));
  ["/user/developer"].forEach((location) => app.use(location, devRegistration));
};