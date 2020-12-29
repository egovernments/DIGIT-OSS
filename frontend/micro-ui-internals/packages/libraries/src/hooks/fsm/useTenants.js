import { useState } from "react";

const useTenants = () => {
  const tenantInfo = Digit.SessionStorage.get("PGR_TENANTS");
  console.log("tenantInfo", tenantInfo);
  const [tenants, setTenants] = useState(tenantInfo ? tenantInfo : null);
  return tenants;
};

export default useTenants;
