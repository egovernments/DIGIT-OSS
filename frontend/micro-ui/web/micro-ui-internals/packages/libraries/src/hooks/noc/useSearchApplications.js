import { NOCSearch } from "../../services/molecules/NOC/Search";
import { useQuery } from "react-query";

const useNOCSearchApplication = (tenantId,filters, config = {}) => {
  return useQuery(
    ["APPLICATION_SEARCH", "NOC_SEARCH", tenantId, ...Object.entries(filters)],
    () => NOCSearch.all(tenantId, filters),
    config
  );
};

export default useNOCSearchApplication;