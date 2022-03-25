import { OBPSService } from "../../services/elements/OBPS";
import { useMutation } from "react-query";

const useObpsAPI = (tenantId, type = false) => {
  if (type) {
    return useMutation((data) => OBPSService.updateNOC(data, tenantId));
  } else {
    return useMutation((data) => OBPSService.update(data, tenantId));
  }
};

export default useObpsAPI;