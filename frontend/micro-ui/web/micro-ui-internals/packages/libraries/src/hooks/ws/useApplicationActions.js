import { useMutation } from "react-query";
import ApplicationUpdateActions from "../../services/molecules/WS/ApplicationUpdateActions";

const useApplicationActions = (businessService) => {
  return useMutation((applicationData) => ApplicationUpdateActions(applicationData, businessService));
};

export default useApplicationActions;
