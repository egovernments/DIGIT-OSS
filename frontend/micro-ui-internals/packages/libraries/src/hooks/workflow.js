import { useQuery } from "react-query";

const useWorkflowDetails = ({ tenantId, id, moduleCode, role = "CITIZEN" }) => {
  const { isLoading, error, isError, data } = useQuery(["workFlowDetails", tenantId, id, moduleCode, role], () =>
    Digit.WorkflowService.getDetailsById({ tenantId, id, moduleCode, role })
  );
  return { isLoading, error, isError, data };
};

export default useWorkflowDetails;
