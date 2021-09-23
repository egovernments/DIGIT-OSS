import { PTService } from "../../services/elements/PT";
import { useMutation } from "react-query";

const usePropertyAssessment = (tenantId, config = {}) => {
  return useMutation((data) => PTService.assessmentCreate(data, tenantId));
};

export default usePropertyAssessment;
