import { WSSearch } from "../../services/molecules/WS/Search";
import { useQuery } from "react-query";

const useDisConnectionDetails = (t, tenantId, applicationNumber, serviceType, config = {}) => {
  return useQuery(
    ["APPLICATION_WS_SEARCH", "WNS_SEARCH", applicationNumber, serviceType,config],
    () => WSSearch.disConnectionDetails(t, tenantId, applicationNumber, serviceType),
    {...config}
  );
};

export default useDisConnectionDetails;
