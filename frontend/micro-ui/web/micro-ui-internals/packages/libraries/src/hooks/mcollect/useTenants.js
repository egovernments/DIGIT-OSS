import React, { useEffect, useState } from "react";

const usemcollectTenants = () => {
  const tenantInfo = Digit.SessionStorage.get("MCollect_TENANTS");
  const [tenants, setTenants] = useState(tenantInfo ? tenantInfo : null);
  return tenants;
};

export default usemcollectTenants;
