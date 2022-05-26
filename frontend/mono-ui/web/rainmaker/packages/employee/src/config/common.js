const commonConfig = {
  MAP_API_KEY: globalConfigExists() ? window.globalConfigs.getConfig("GMAPS_API_KEY") : process.env.REACT_APP_GMAPS_API_KEY,
  tenantId: globalConfigExists() ? window.globalConfigs.getConfig("STATE_LEVEL_TENANT_ID") : process.env.REACT_APP_DEFAULT_TENANT_ID,
  singleInstance: globalConfigExists() ? window.globalConfigs.getConfig("ENABLE_SINGLEINSTANCE") || false : false,
  S3BUCKET: globalConfigExists() ? window.globalConfigs.getConfig("S3BUCKET") :"egov-qa-assets",
  // forgotPasswordTenant: "pb.amritsar",
};

function globalConfigExists() {
  return typeof window.globalConfigs !== "undefined" && typeof window.globalConfigs.getConfig === "function";
}

export default commonConfig;
