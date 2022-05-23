import { WSSearch } from "../../services/molecules/WS/Search";
import { useQuery } from "react-query";

const useWSDetailsPage = (t, tenantId, applicationNumber, serviceType, config = {}) => {
  return useQuery(
    ["APPLICATION_WS_SEARCH", "WNS_SEARCH", applicationNumber, serviceType],
    () => WSSearch.applicationDetails(t, tenantId, applicationNumber, serviceType),
    config
  );
};

export default useWSDetailsPage;
