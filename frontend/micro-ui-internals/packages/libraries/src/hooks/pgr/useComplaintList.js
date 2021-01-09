import { useQuery } from "react-query";

export const useComplaintsList = (tenantId, filters) => {
  // TODO: move city to state
  const { isLoading, error, data } = useQuery(["complaintsList", filters], () => Digit.PGRService.search(tenantId, filters));
  return { isLoading, error, data };
};

export const useComplaintsListByMobile = (tenantId, mobileNumber) => {
  return useComplaintsList(tenantId, { mobileNumber });
};
