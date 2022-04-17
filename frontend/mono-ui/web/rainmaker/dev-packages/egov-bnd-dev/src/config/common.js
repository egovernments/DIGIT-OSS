const commonConfig = {
  MAP_API_KEY: process.env.REACT_APP_GMAPS_API_KEY ? process.env.REACT_APP_GMAPS_API_KEY : "AIzaSyCH9PmCbk_mcpgijAAlTeltC4deOxC5wEM",
  tenantId: process.env.REACT_APP_DEFAULT_TENANT_ID
  // forgotPasswordTenant: "pb.amritsar",
};

export default commonConfig;
