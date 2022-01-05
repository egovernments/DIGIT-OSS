import { useQuery } from "react-query";
import { MdmsService } from "../../services/elements/MDMS";

const useTLGenderMDMS = (tenantId, moduleCode, type, config = {}) => {
  const useTLGenders = () => {
    return useQuery("TL_GENDER_DETAILS", () => MdmsService.TLGenderType(tenantId, moduleCode ,type), config);
  };
  

  switch (type) {
    case "GenderType":
      return useTLGenders();
    default:
      return null;
  }
};



export default useTLGenderMDMS;