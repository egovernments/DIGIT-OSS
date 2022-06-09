import { useMutation } from "react-query";
import { FSMService } from "../../services/elements/FSM";

const useVendorUpdate = (tenantId) => {
  return useMutation((vendorData) => VendorUpdateActions(vendorData, tenantId));
};

const VendorUpdateActions = async (vendorData, tenantId) => {
  try {
    const response = await FSMService.updateVendor(vendorData, tenantId);
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.Errors[0].message);
  }
};

export default useVendorUpdate;
