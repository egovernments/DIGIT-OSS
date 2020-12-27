import React, { useEffect, useState } from "react";

const useTenants = () => {
  const tenantInfo = Digit.SessionStorage.get("PGR_TENANTS");
  console.log("tenantInfo", tenantInfo);
  const [tenants, setTenants] = useState(tenantInfo ? tenantInfo : null);
  // useEffect(() => {
  //   setTenants(tenantInfo.filter((tenant) => tenant.type === "CITY"));
  // }, [tenantInfo]);
  return tenants;
};

export default useTenants;
