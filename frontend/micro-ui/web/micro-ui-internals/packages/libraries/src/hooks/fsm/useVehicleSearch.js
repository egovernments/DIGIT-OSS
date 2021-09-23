import { useQuery } from "react-query";
import { Search } from "../../services/molecules/FSM/Search";

const useVehicleSearch = (args) => {
  const { tenantId, filters, config, options } = args;
  const searchWithDSO = options?.searchWithDSO;
  return useQuery(
    ["FSM_VEHICLE_DATA", args],
    () => (searchWithDSO ? Search.allVehiclesWithDSO(tenantId, filters) : Search.allVehicles(tenantId, filters)),
    config
  );
};

export default useVehicleSearch;
