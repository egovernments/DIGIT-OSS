import { useQuery } from "react-query";
import { FSMService } from "../../services/elements/FSM";

const useDriverSearch = (args) => {
  const { tenantId, filters, config } = args;
  return useQuery(["FSM_DRIVER_SEARCH", filters], () => FSMService.driverSearch(tenantId, filters), config);
};

export default useDriverSearch;
