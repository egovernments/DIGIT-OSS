import { useQuery } from "react-query";
import { Search } from "../../services/molecules/OBPS/Search";

const useScrutinyDetails = (tenantId, filters, config) => {
  return useQuery(["OBPS_SCRUTINYDETAILS", filters], () => Search.scrutinyDetails(tenantId, filters), config);
}

export default useScrutinyDetails; 
