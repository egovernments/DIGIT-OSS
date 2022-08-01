import { useQuery } from "react-query";
import { FSMService } from "../../services/elements/FSM";

const useVendorSearch = (args) => {
  const { tenantId, filters, config } = args;
  return useQuery(["FSM_VENDOR_SEARCH", filters], () => FSMService.vendorSearch(tenantId, filters), config);
};

export default useVendorSearch;
