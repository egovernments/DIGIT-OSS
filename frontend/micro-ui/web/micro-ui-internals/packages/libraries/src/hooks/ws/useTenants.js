import React, { useEffect, useState } from "react";

const usewsTenants = () => {
  const tenantInfo = Digit.SessionStorage.get("WS_TENANTS");
  const [tenants, setTenants] = useState(tenantInfo ? tenantInfo : null);
  return tenants;
};

export default usewsTenants;
