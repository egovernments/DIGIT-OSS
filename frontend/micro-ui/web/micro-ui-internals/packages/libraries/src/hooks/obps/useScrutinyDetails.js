import { useQuery } from "react-query";
import { Search } from "../../services/molecules/OBPS/Search";

const useScrutinyDetails = (tenantId, filters, config, key = "OBPS_SCRUTINYDETAILS") => {
  return useQuery([key, filters], async () => {
    const scruntinyData = await Search.scrutinyDetails(tenantId, filters, undefined, true);
    return Search.scrutinyDetails(scruntinyData?.tenantId || tenantId, filters, undefined, true);
  }, config)
}

export default useScrutinyDetails; 
