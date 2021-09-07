import { useMutation } from "react-query";
import ApplicationUpdateActions from "../../services/molecules/FSM/ApplicationUpdateActions";

const useApplicationActions = (tenantId) => {
  return useMutation((applicationData) => ApplicationUpdateActions(applicationData, tenantId));
};

export default useApplicationActions;
