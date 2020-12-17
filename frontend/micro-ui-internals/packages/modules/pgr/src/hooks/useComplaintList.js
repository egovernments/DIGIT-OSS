import { useQuery } from "react-query";

export const useComplaintsList = (filters = {}) => {
  // TODO: move city to state
  const { isLoading, error, data } = useQuery(["complaintsList", filters], () => Digit.PGRService.search("pb.amritsar", filters));
  return { isLoading, error, data };
};

export const useComplaintsListByMobile = (mobileNumber) => {
  return useComplaintsList({ mobileNumber });
};
