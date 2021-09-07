import { useMutation } from "react-query";
import ApplicationUpdateActions from "../../services/molecules/PT/ApplicationUpdateActions";

const useApplicationActions = (tenantId) => {
  return useMutation((applicationData) => ApplicationUpdateActions(applicationData, tenantId));
};

export default useApplicationActions;
