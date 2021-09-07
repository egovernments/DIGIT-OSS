import { useQuery } from "react-query";
import { FSMService } from "../../services/elements/FSM";

const useVendorDetail = (filters = {}, config = {}) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { uuid } = Digit.UserService.getUser().info;
  return useQuery(["FSM_VENDOR_SEARCH", filters], () => FSMService.vendorSearch(tenantId, { ...filters, ownerIds: uuid }), config);
};

export default useVendorDetail;
