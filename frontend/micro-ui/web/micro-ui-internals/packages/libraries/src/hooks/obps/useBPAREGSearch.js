import { useQuery } from "react-query"

const useBPAREGSearch = (tenantId, filters) => {
  return useQuery([tenantId, filters], () => Digit.OBPSService.BPAREGSearch(tenantId, filters))
}

export default useBPAREGSearch;