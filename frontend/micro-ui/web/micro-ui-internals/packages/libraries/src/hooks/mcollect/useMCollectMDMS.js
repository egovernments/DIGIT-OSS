import { useQuery } from "react-query";
import { MdmsService } from "../../services/elements/MDMS";

const useMCollectMDMS = (tenantId, moduleCode, type, filter, config = {}) => {
  const useMCollectBillingService = () => {
    return useQuery("MCOLLECT_BILLING_SERVICE", () => MdmsService.getMCollectBillingService(tenantId, moduleCode, type, filter), config);
  };
  const useMCollectApplcationStatus = () => {
    return useQuery("MCOLLECT_APPLICATION_STATUS", () => MdmsService.getMCollectApplcationStatus(tenantId, moduleCode, type, filter), config);
  };

  switch (type) {
    case "BusinessService":
      return useMCollectBillingService();
    case "applicationStatus":
      return useMCollectApplcationStatus();
    default:
      return null;
  }
};

export default useMCollectMDMS;
