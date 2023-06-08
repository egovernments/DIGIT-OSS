import { OBPSService } from "../../services/elements/OBPS";
import { useMutation } from "react-query";

const useStakeholderAPI = (tenantId, type = false) => {
      return useMutation((data) => {
        console.log("FORMDATA...3",data)
        let temp = data;
        temp.Licenses[0].applicationNumber = sessionStorage.getItem("TECHNICAL_PROFESSIONAL_APPLICATION_NO") || "";
        sessionStorage.removeItem("TECHNICAL_PROFESSIONAL_APPLICATION_NO");
        return OBPSService.BPAREGupdate(temp, tenantId);
      });  
  };

  export default useStakeholderAPI;