import { Search } from "../../services/molecules/FSM/Search";
import { useQuery } from "react-query";

const useApplicationDetail = (t, tenantId, applicationNos, config = {}, userType) => {
  return useQuery(["FSM_CITIZEN_SEARCH", applicationNos, userType], () => Search.applicationDetails(t, tenantId, applicationNos, userType), config);
};

export default useApplicationDetail;
