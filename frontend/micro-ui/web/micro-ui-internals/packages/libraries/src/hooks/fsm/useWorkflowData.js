import React from "react";
import { useQuery } from "react-query";
import { WorkflowService } from "../../services/elements/WorkFlow";

const useWorkflowData = (tenantId, businessIds) => {
  return useQuery("WORKFLOW_BY_ID", () => WorkflowService.getByBusinessId(tenantId, businessIds), { staleTime: Infinity });
};

export default useWorkflowData;
