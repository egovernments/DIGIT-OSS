import { useQuery } from "react-query";
import VehicleDetails from "../../services/molecules/FSM/VehicleDetails";

const useVehicleDetails = (tenantId, filters, config = {}) => {
  return useQuery(["VEHICLE_SEARCH", filters], () => VehicleDetails(tenantId, filters), config);
};

export default useVehicleDetails;
