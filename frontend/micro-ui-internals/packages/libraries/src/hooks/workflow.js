import { useQuery, useQueryClient } from "react-query";

const useWorkflowDetails = ({ tenantId, id, moduleCode, role = "CITIZEN" }) => {
  const queryClient = useQueryClient();
  const { isLoading, error, isError, data } = useQuery(["workFlowDetails", tenantId, id, moduleCode, role], () =>
    Digit.WorkflowService.getDetailsById({ tenantId, id, moduleCode, role })
  );

  return { isLoading, error, isError, data, revalidate: () => queryClient.invalidateQueries(["workFlowDetails", tenantId, id, moduleCode, role]) };
};

export default useWorkflowDetails;
