import { useQuery, useQueryClient } from "react-query";

export const useComplaintsList = (tenantId, filters) => {
  // TODO: move city to state
  const client = useQueryClient();
  const { isLoading, error, data } = useQuery(["complaintsList", filters], () => Digit.PGRService.search(tenantId, filters), {});
  return { isLoading, error, data, revalidate: () => client.invalidateQueries(["complaintsList", filters]) };
};

export const useComplaintsListByMobile = (tenantId, mobileNumber) => {
  return useComplaintsList(tenantId, { mobileNumber });
};
