import { useQuery } from "react-query";
import { Search } from "../../services/molecules/OBPS/Search";

const useNocDetails = (tenantId, filters, config) => {
  return useQuery(["OBPS_NOCDETAILSs", filters], () => Search.NOCDetails(tenantId, filters), config);
}

export default useNocDetails; 
