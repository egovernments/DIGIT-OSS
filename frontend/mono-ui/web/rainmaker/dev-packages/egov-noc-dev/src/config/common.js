const commonConfig = {
  MAP_API_KEY: "AIzaSyCH9PmCbk_mcpgijAAlTeltC4deOxC5wEM",
  tenantId: process.env.REACT_APP_DEFAULT_TENANT_ID,
  singleInstance: window.globalConfigs
    ? window.globalConfigs.getConfig("ENABLE_SINGLEINSTANCE") || false
    : false,

  // forgotPasswordTenant: "pb.amritsar",
};

export default commonConfig;
