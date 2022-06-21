import { useMutation } from "react-query";
import { FSMService } from "../../services/elements/FSM";

const useDriverUpdate = (tenantId) => {
  return useMutation((vendorData) => DriverUpdateActions(vendorData, tenantId));
};

const DriverUpdateActions = async (vendorData, tenantId) => {
  try {
    const response = await FSMService.updateDriver(vendorData, tenantId);
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.Errors[0].message);
  }
};

export default useDriverUpdate;
