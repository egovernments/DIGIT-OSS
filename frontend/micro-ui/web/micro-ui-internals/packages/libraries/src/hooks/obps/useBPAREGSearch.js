import { useQuery,useQueryClient } from "react-query";

const useBPAREGSearch = (tenantId, filters, params, config = {}) => {
  const client = useQueryClient();

  return {...useQuery(['BPA_REG_SEARCH', tenantId, filters, params], () => Digit.OBPSService.BPAREGSearch(tenantId, filters, params), config),revalidate: () => client.removeQueries(['BPA_REG_SEARCH', tenantId, filters])}
}

export default useBPAREGSearch;