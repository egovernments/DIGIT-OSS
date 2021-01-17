import { MdmsService } from "../../services/molecules/MDMS";
import { useQuery } from "react-query";

const useMDMS = (tenantId, moduleCode, type, config = {}) => {
  const useSanitationType = () => {
    return useQuery("FSM_SANITATION_TYPE", () => MdmsService.getSanitationType(tenantId, moduleCode), config);
  };

  const useApplicationChannel = () => {
    return useQuery("FSM_APPLICATION_CHANNEL", () => MdmsService.getApplicationChannel(tenantId, moduleCode, type), config);
  };

  const usePropertyType = () => {
    return useQuery("FSM_PROPERTY_TYPE", () => MdmsService.getPropertyType(tenantId, moduleCode, type), config);
  };

  const usePropertySubType = () => {
    return useQuery("FSM_PROPERTY_SUBTYPE", () => MdmsService.getPropertyType(tenantId, moduleCode, type), config);
  };

  switch (type) {
    case "SanitationType":
      return useSanitationType();

    case "ApplicationChannel":
      return useApplicationChannel();

    case "PropertyType":
      return usePropertyType();

    case "PropertySubtype":
      return usePropertySubType();
  }
};

export default useMDMS;
