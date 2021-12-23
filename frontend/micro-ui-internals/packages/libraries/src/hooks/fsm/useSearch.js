import { Search } from "../../services/molecules/FSM/Search";
import { useQuery } from "react-query";

const useSearch = (tenantId, filters, config = {}) => {
  return useQuery(["FSM_CITIZEN_SEARCH", filters], () => Search.application(tenantId, filters), config);
};

export default useSearch;
