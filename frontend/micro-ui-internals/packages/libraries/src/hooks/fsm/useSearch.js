import { Search } from "../../services/molecules/FSM/Search";
import { useQuery } from "react-query";

const useSearchAll = (tenantId, config = {}) => {
  return useQuery("FSM_CITIZEN_SEARCH_ALL", () => Search.all(tenantId), config);
};

export default useSearchAll;
