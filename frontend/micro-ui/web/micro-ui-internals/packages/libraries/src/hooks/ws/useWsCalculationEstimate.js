import { useMutation } from "react-query";
import { WSService } from "../../services/elements/WS";

const useWsCalculationEstimate = (tenantId, config = {}) => {
  return useMutation((data) => WSService.wsCalculationEstimate(data, tenantId));
};

export default useWsCalculationEstimate;
