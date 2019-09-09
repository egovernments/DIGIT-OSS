const commonConfig = {
  MAP_API_KEY: "AIzaSyCH9PmCbk_mcpgijAAlTeltC4deOxC5wEM",
  tenantId: globalConfigExists() ? window.globalConfigs.getConfig('STATE_LEVEL_TENANT_ID') : process.env.REACT_APP_DEFAULT_TENANT_ID,
  // forgotPasswordTenant: "pb.amritsar",
};

function globalConfigExists(){
  return typeof window.globalConfigs !== 'undefined' && typeof window.globalConfigs.getConfig === 'function';  
 }

export default commonConfig;
