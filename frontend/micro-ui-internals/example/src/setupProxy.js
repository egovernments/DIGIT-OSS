const { createProxyMiddleware } = require("http-proxy-middleware");
const createProxy = createProxyMiddleware({
  // target: "https://egov-micro-qa.egovernments.org",
  target: "https://egov-micro-dev.egovernments.org",
  changeOrigin: true,
});
module.exports = function (app) {
  ["/egov-mdms-service", "/egov-location", "/localization", "/egov-workflow-v2", "/pgr-services", "/filestore"].forEach((location) =>
    app.use(location, createProxy)
  );
};
