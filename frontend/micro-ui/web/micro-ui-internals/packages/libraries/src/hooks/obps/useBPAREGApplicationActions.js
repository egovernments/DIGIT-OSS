import { useMutation } from "react-query";
import BPAREGApplicationUpdateActions from "../../services/molecules/OBPS/BPAREGApplicationUpdateActions";

const useBPAREGApplicationActions = (tenantId) => {
  return useMutation((applicationData) => BPAREGApplicationUpdateActions(applicationData, tenantId));
};

export default useBPAREGApplicationActions;
