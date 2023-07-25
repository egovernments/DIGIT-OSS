import { useQuery } from "react-query";
import { MdmsService } from "../services/elements/MDMS";

const useGenderMDMS = (tenantId, moduleCode, type, config = {}) => {
  const useGenderDetails = () => {
    return useQuery("GENDER_DETAILS", () => MdmsService.getGenderType(tenantId, moduleCode ,type), config);
  };
  

  switch (type) {
    case "GenderType":
      return useGenderDetails();
  }
};



export default useGenderMDMS;
