import { useQuery } from "react-query";
import DriverDetails from "../../services/molecules/FSM/DriverDetails";

const useDriverDetails = (tenantId, filters, config = {}) => {
  return useQuery(["DRIVER_SEARCH", filters], () => DriverDetails(tenantId, filters), config);
};

export default useDriverDetails;
