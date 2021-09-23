import { useQuery } from "react-query";
import { Search } from "../../services/molecules/OBPS/Search";

const useScrutinyDetails = (tenantId, filters, config) => {
  return useQuery(["OBPS_SCRUTINYDETAILS", filters], async () => {
    const scruntinyData = await Search.scrutinyDetails(tenantId, filters);
    return Search.scrutinyDetails(scruntinyData?.tenantId, filters);
  }, config)
}

export default useScrutinyDetails; 
