import { MdmsService } from "../../services/molecules/MDMS";
import { useQuery } from "react-query";

const useMDMS = (tenantId, moduleCode, type, config = {}) => {
  const useSanitationType = () => {
    return useQuery("FSM_SANITATION_TYPE", () => MdmsService.getSanitationType(tenantId, moduleCode), config);
  };

  const useApplicationChannel = () => {
    return useQuery("FSM_APPLICATION_CHANNEL", () => MdmsService.getApplicationChannel(tenantId, moduleCode), config);
  };

  switch (type) {
    case "SanitationType":
      return useSanitationType();

    case "ApplicationChannel":
      return useApplicationChannel();
  }
};

export default useMDMS;
