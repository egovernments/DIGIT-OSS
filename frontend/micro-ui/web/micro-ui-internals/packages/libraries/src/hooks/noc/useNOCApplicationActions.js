import { useMutation } from "react-query";
import ApplicationUpdateActions from "../../services/molecules/NOC/ApplicationUpdateActions";

const useNOCApplicationActions = (tenantId) => {
  return useMutation((applicationData) => ApplicationUpdateActions(applicationData, tenantId));
};

export default useNOCApplicationActions;