import { useMutation } from "react-query";
import { FSMService } from "../../services/elements/FSM";

const useVehicleCreate = (tenantId) => {
  return useMutation((vendorData) => VehicleCreateActions(vendorData, tenantId));
};

const VehicleCreateActions = async (vendorData, tenantId) => {
  try {
    const response = await FSMService.createVehicle(vendorData, tenantId);
    return response;
  } catch (error) {
    throw new Error(error?.response?.data?.Errors[0].message);
  }
};

export default useVehicleCreate;
