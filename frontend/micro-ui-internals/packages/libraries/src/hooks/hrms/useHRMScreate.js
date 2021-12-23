import { useQuery, useMutation } from "react-query";
import HrmsService from "../../services/elements/HRMS";

export const useHRMSCreate = (tenantId, config = {}) => {
  return useMutation((data) => HrmsService.create(data, tenantId));
};

export default useHRMSCreate;
