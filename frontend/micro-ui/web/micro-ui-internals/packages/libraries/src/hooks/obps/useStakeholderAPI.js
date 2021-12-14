import { OBPSService } from "../../services/elements/OBPS";
import { useMutation } from "react-query";

const useStakeholderAPI = (tenantId, type = false) => {
      return useMutation((data) => OBPSService.BPAREGupdate(data, tenantId));  
  };

  export default useStakeholderAPI;