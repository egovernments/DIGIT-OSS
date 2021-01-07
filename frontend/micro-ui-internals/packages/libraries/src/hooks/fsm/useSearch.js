import { Search } from "../../services/molecules/FSM/Search";
import { useQuery } from "react-query";

const useSearchAll = (tenantId, applicationNumber = "", config = {}) => {
  return useQuery(["FSM_CITIZEN_SEARCH", applicationNumber], () => Search.application(tenantId, applicationNumber), config);
};

export default useSearchAll;
