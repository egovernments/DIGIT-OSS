import { WSSearch } from "../../services/molecules/WS/Search";
import { useQuery } from "react-query";

const useConnectionDetail = (t, tenantId, connectionNumber, serviceType, config = {}) => {
  return useQuery(
    ["APPLICATION_WS_SEARCH", "WNS_SEARCH", connectionNumber, serviceType],
    () => WSSearch.connectionDetails(t, tenantId, connectionNumber, serviceType),
    config
  );
};

export default useConnectionDetail;
