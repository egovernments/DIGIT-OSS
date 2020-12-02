import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useTenants = () => {
  const tenantInfo = useSelector((state) => state["common"].tenants);
  console.log("tenantInfo", tenantInfo);
  const [tenants, setTenants] = useState(null);
  useEffect(() => {
    setTenants(tenantInfo.filter((tenant) => tenant.type === "CITY"));
  }, [tenantInfo]);
  return tenants;
};

export default useTenants;
