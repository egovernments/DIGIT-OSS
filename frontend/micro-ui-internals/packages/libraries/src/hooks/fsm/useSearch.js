import { Search } from "../../services/molecules/FSM/Search";
import { useQuery } from "react-query";

const useSearchAll = ({ tenantId, uuid, applicationNumber = "", config = {} }) => {
  return useQuery(["FSM_CITIZEN_SEARCH", applicationNumber], () => Search.application(tenantId, applicationNumber, uuid), config);
};

export default useSearchAll;
