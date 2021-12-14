import { stateTenant } from "../utils/commons";

let tenent = stateTenant()||"";

const commonConfig = {
  MAP_API_KEY: "AIzaSyBN01pR2wGavj2_q3v4-vFgQzmcx-gllk0",
  tenantId: tenent,
  forgotPasswordTenant: `${localStorage.getItem('tenant-id')}`
};

export default commonConfig;
