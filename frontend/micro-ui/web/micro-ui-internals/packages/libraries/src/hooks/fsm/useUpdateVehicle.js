import { useMutation } from "react-query";
import { FSMService } from "../../services/elements/FSM";

const useUpdateVehicle = (tenantId) => {
  return useMutation((vendorData) => VehicleUpdateActions(vendorData, tenantId));
};

const VehicleUpdateActions = async (vendorData, tenantId) => {
  try {
    const response = await FSMService.updateVehicle(vendorData, tenantId);
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.Errors[0].message);
  }
};

export default useUpdateVehicle;
