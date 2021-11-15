import { useQuery } from "react-query";

const useBPADetailsPage = (tenantId, filters, config) => {
  return useQuery(['BPA_DETAILS_PAGE', filters, tenantId], () => Digit.OBPSService.BPADetailsPage(tenantId, filters), config);
}

export default useBPADetailsPage;