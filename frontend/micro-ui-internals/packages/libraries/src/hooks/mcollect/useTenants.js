import React, { useEffect, useState } from "react";

const usemcollectTenants = () => {
  const tenantInfo = Digit.SessionStorage.get("MCollect_TENANTS");
  const [tenants, setTenants] = useState(tenantInfo ? tenantInfo : null);
  // useEffect(() => {
  //   setTenants(tenantInfo.filter((tenant) => tenant.type === "CITY"));
  // }, [tenantInfo]);
  return tenants;
};

export default usemcollectTenants;
