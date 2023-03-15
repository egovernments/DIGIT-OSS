import React from "react";
import { useQuery } from "react-query";

const useBusinessServiceData = (tenantId, businessServices, config) => {
  return useQuery(['BUSSRVICEDATA_DETAIL', businessServices, tenantId], () => Digit.WorkflowService.init(tenantId, businessServices), config)
};

export default useBusinessServiceData;