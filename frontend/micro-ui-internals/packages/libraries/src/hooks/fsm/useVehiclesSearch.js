import { useQuery } from "react-query";
import { FSMService } from "../../services/elements/FSM";

const useVehiclesSearch = (args) => {
  const { tenantId, filters, config } = args;
  return useQuery(["FSM_VEICLES_SEARCH", filters], () => FSMService.vehiclesSearch(tenantId, filters), config);
};

export default useVehiclesSearch;
