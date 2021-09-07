import { useQuery } from "react-query";
import { MdmsService } from "../../services/elements/MDMS";

const useHRMSGenderMDMS = (tenantId, moduleCode, type, config = {}) => {
  const useHRGenders = () => {
    return useQuery("HR_GENDER_DETAILS", () => MdmsService.HRGenderType(tenantId, moduleCode ,type), config);
  };
  

  switch (type) {
    case "GenderType":
      return useHRGenders();
  }
};



export default useHRMSGenderMDMS;