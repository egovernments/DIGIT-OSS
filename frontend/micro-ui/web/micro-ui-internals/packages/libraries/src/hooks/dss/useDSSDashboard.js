import { useQueries } from "react-query";
import { getDSSDashboardData } from "../../services/molecules/DSS/getDSSDashboardData";

const useDSSDashboard = (stateCode, mdmsType, moduleCode, config) => {
  return useQueries(getDSSDashboardData(stateCode, mdmsType, moduleCode, config));
};

export default useDSSDashboard;
