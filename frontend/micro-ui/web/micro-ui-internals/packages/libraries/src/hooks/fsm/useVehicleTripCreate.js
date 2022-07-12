import { useMutation } from "react-query";
import { FSMService } from "../../services/elements/FSM";
const useVehicleTripCreate = () => {
    return useMutation((details) => FSMService.vehicleTripCreate(details));
};
export default useVehicleTripCreate;