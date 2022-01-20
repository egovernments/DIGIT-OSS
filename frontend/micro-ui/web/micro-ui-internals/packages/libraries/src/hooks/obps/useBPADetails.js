import { useQuery } from "react-query";
import { Search } from "../../services/molecules/OBPS/Search";

const useBPADetails = (tenantId, filters, config) => {
  return useQuery(["OBPS_BPADETAILS", filters], () => Search.BPADetails(tenantId, filters), config);
}

export default useBPADetails; 
