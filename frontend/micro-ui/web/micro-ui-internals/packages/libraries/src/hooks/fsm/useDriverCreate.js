import { useMutation } from "react-query";
import { FSMService } from "../../services/elements/FSM";

const useDriverCreate = (tenantId) => {
  return useMutation((vendorData) => DriverCreateActions(vendorData, tenantId));
};

const DriverCreateActions = async (vendorData, tenantId) => {
  try {
    const response = await FSMService.createDriver(vendorData, tenantId);
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.Errors[0].message);
  }
};

export default useDriverCreate;
