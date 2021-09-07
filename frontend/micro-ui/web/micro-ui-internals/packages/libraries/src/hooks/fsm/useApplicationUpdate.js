import { useMutation } from "react-query";
import { FSMService } from "../../services/elements/FSM";

const useApplicationUpdate = (tenantId) => {
  return useMutation((details) => FSMService.update(details, tenantId));
};

export default useApplicationUpdate;
