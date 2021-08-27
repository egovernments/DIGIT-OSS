import { useQuery, useMutation } from "react-query";
import HrmsService from "../../services/elements/HRMS";

export const useHRMSUpdate = (tenantId, config = {}) => {
  return useMutation((data) => HrmsService.update(data, tenantId));
};

export default useHRMSUpdate;
