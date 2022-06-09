import { useQuery } from "react-query";
import { MdmsService } from "../../services/elements/MDMS";

const useDssMDMS = (tenantId, moduleCode, type, config) => {
  const useDssDashboard = () => {
    return useQuery("DSS_DASHBOARD", () => MdmsService.getDssDashboard(tenantId, moduleCode), config);
  };
  const _default = () => {
    return useQuery([tenantId, moduleCode, type], () => MdmsService.getMultipleTypes(tenantId, moduleCode, type), config);
  };

  switch (type) {
    case "DssDashboard":
      return useDssDashboard();
    default:
      return _default();
  }
};

export default useDssMDMS;
