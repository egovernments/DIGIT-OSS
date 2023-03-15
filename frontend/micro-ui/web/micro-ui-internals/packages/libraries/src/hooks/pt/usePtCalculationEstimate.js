import { PTService } from "../../services/elements/PT";
import { useMutation } from "react-query";

const usePtCalculationEstimate = (tenantId, config = {}) => {
  return useMutation((data) => PTService.ptCalculationEstimate(data, tenantId));
};

export default usePtCalculationEstimate;
