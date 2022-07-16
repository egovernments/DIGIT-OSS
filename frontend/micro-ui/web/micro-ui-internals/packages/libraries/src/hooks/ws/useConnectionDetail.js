import { WSSearch } from "../../services/molecules/WS/Search";
import { useQuery, useQueryClient } from "react-query";

const useConnectionDetail = (t, tenantId, connectionNumber, serviceType, config = {}) => {
  const client = useQueryClient();
  const { isLoading, error, data, isSuccess } = useQuery(
    ["APPLICATION_WS_SEARCH", "WNS_SEARCH", connectionNumber, serviceType, config],
    () => WSSearch.connectionDetails(t, tenantId, connectionNumber, serviceType),
    config
  );
  return {
    isLoading,
    error,
    data,
    isSuccess,
    revalidate: () => client.invalidateQueries(["APPLICATION_WS_SEARCH", "WNS_SEARCH", connectionNumber, serviceType]),
  };
};

export default useConnectionDetail;
