import React, { useState } from "react";

const useTenants = () => {
  const tenantInfo = Digit.SessionStorage.get("BILLS_TENANTS");

  const [tenants, setTenants] = useState(tenantInfo ? tenantInfo : null);

  return tenants;
};

export default useTenants;
