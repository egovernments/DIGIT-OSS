import React from "react";
import { useQuery } from "react-query";

const useLicenseDetails = (tenantId, filters, config) => {
  return useQuery(['LICENSE_DETAIL', filters, tenantId], () => Digit.OBPSService.LicenseDetails(tenantId, filters), config)
};

export default useLicenseDetails;