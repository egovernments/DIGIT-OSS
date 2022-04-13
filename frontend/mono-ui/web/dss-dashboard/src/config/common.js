import { getTenantId, stateTenant } from "../utils/commons";

let tenent = stateTenant()||"";

const commonConfig = {
  MAP_API_KEY:  window.globalConfigs.getConfig("GMAPS_API_KEY"),
  tenantId: tenent,
  forgotPasswordTenant: `${getTenantId()}`
};

export default commonConfig;
