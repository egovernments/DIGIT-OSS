import { useQuery, useQueryClient } from "react-query";
import HrmsService from "../../services/elements/HRMS";

export const useHRMSCount = (tenantId, config = {}) => {
  return useQuery(["HRMS_COUNT", tenantId], () => HrmsService.count(tenantId), config);
};

export default useHRMSCount;
