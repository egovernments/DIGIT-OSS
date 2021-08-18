import { PTSearch } from "../../services/molecules/PT/Search";
import { useQuery } from "react-query";

const useApplicationDetail = (t, tenantId, propertyIds, config = {}, userType) => {
  return useQuery(["PT_SEARCH", propertyIds, userType], () => PTSearch.applicationDetails(t, tenantId, propertyIds, userType), config);
};

export default useApplicationDetail;
