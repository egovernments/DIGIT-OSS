import { useMutation } from "react-query";
import { FSMService } from "../../services/elements/FSM";

const useVendorCreate = (tenantId) => {
  return useMutation((vendorData) => VendorCreateActions(vendorData, tenantId));
};

const VendorCreateActions = async (vendorData, tenantId) => {
  try {
    const response = await FSMService.createVendor(vendorData, tenantId);
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.Errors[0].message);
  }
};

export default useVendorCreate;
