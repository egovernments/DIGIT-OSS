import { WSSearch } from "../../services/molecules/WS/Search";
import { useQuery } from "react-query";

const useWSDetailsPage = (t, tenantId, applicationNumber, serviceType, userInfo, config = {}) => {
  return useQuery(
    ["APPLICATION_WS_SEARCH", "WNS_SEARCH", applicationNumber, serviceType, userInfo,config],
    () => WSSearch.applicationDetails(t, tenantId, applicationNumber, serviceType, userInfo),
    {...config}
  );
};

export default useWSDetailsPage;
