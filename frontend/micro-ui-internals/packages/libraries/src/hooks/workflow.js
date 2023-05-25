import { useQuery, useQueryClient } from "react-query";

const useWorkflowDetails = ({ tenantId, id, moduleCode, role = "CITIZEN", serviceData = {}, getStaleData, config }) => {
  const queryClient = useQueryClient();

  const staleDataConfig = { staleTime: Infinity };

  // console.log("ok this ", getStaleData, staleDataConfig);

  const { isLoading, error, isError, data } = useQuery(
    ["workFlowDetails", tenantId, id, moduleCode, role],
    () => Digit.WorkflowService.getDetailsById({ tenantId, id, moduleCode, role }),
    getStaleData ? { ...staleDataConfig, ...config } : config
  );

  if (getStaleData) return { isLoading, error, isError, data };

  return { isLoading, error, isError, data, revalidate: () => queryClient.invalidateQueries(["workFlowDetails", tenantId, id, moduleCode, role]) };
};

export default useWorkflowDetails;
