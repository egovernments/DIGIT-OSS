const { createProxyMiddleware } = require("http-proxy-middleware");

const createProxy = createProxyMiddleware({
  //target: process.env.REACT_APP_PROXY_API || "https://uat.digit.org",
  // target: process.env.REACT_APP_PROXY_API || "https://qa.digit.org",
  target: process.env.REACT_APP_PROXY_API || "https://qa.digit.org",
  changeOrigin: true,
});
const assetsProxy = createProxyMiddleware({
  target: process.env.REACT_APP_PROXY_ASSETS || "https://qa.digit.org",
  changeOrigin: true,
});
const apiSetuProxy = createProxyMiddleware({
  target: process.env.REACT_APP_PROXY_API_SETU || "https://qa.digit.org",
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
    "/certificate/v3/pan",
  ].forEach((location) => app.use(location,apiSetuProxy ));
  // ["/egov-mdms-service/v1"].forEach((location) => app.use(location, LicProxy));
  
};
