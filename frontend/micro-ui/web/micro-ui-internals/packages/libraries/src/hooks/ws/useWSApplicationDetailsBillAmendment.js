import { WSSearch } from "../../services/molecules/WS/Search";
import { useQuery } from "react-query";

const useWSApplicationDetailsBillAmendment = (t, tenantId, applicationNumber, serviceType, config = {}) => {
  return useQuery(
    ["APPLICATION_WS_SEARCH", "WNS_SEARCH", tenantId, applicationNumber, serviceType],
    () => WSSearch.applicationDetailsBillAmendment(t, tenantId, applicationNumber, serviceType),
    config
  );
};

export default useWSApplicationDetailsBillAmendment;
