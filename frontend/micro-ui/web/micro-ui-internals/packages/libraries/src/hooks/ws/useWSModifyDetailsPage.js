import { WSSearch } from "../../services/molecules/WS/Search";
import { useQuery } from "react-query";

const useWSModifyDetailsPage = (t, tenantId, applicationNumber, serviceType, userInfo, config = {}) => {
  return useQuery(
    ["APPLICATION_WS_SEARCH", "WNS_SEARCH", applicationNumber, serviceType, userInfo, config],
    () => WSSearch.modifyApplicationDetails(t, tenantId, applicationNumber, serviceType, userInfo),
    { ...config }
  );
};

export default useWSModifyDetailsPage;
