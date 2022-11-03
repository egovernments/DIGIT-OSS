import { useQuery } from "react-query";
import { FSMService } from "../../services/elements/FSM";

const useAdvanceBalanceCalulation = ({ tenantId, filters }) => {
  return useQuery(["ADVANCE_BALANCE_CALCULATION", tenantId, filters], async () => await FSMService.advanceBalanceCalculate({ tenantId, filters }));
};
export default useAdvanceBalanceCalulation;
