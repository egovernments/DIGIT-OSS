import { useQuery } from "react-query";
import { MdmsService } from "../../services/elements/MDMS";

const useDssMDMS = (tenantId, moduleCode, type, config) => {
  const useDssDashboard = () => {
    return useQuery("DSS_DASHBOARD", () => MdmsService.getDssDashboard(tenantId, moduleCode), config);
  };

  switch (type) {
    case "DssDashboard":
      return useDssDashboard();
  }
};

export default useDssMDMS;
