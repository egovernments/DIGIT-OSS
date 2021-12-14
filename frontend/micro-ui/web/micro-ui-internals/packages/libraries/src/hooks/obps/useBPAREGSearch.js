import { useQuery } from "react-query"

const useBPAREGSearch = (tenantId, filters, params, config = {}) => {
  return useQuery(['BPA_REG_SEARCH', tenantId, filters], () => Digit.OBPSService.BPAREGSearch(tenantId, filters, params), config)
}

export default useBPAREGSearch;