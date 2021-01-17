import { Search } from "../../services/molecules/FSM/Search";
import { useQuery } from "react-query";

const useSearchAll = ({ tenantId, uuid, applicationNumber = "", limit = 100, config = {} }) => {
  return useQuery(["FSM_CITIZEN_SEARCH", applicationNumber], () => Search.application(tenantId, applicationNumber, uuid, limit), config);
};

export default useSearchAll;
