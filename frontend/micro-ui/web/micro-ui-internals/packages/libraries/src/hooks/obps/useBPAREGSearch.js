import { useQuery } from "react-query"

const useBPAREGSearch = (tenantId, filters, params, config = {}) => {
  console.log(params,"param in hook");
  return useQuery(['BPA_REG_SEARCH', tenantId, filters], () => Digit.OBPSService.BPAREGSearch(tenantId, filters, params), config)

}

export default useBPAREGSearch;