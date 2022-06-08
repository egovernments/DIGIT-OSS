import { useQuery, useQueryClient } from "react-query";

export const useMypaymentWS = ({ tenantId, filters, BusinessService="WS",searchedFrom="" }, config = {}) => {
  const client = useQueryClient();
  const args = tenantId ? { tenantId, filters, BusinessService } : { filters, BusinessService };

  const { isLoading, error, data, isSuccess } = useQuery(["WSSearchList", tenantId, filters, BusinessService], () => Digit.WSService.paymentsearch(args), {
    ...config,
  });

  return {isLoading,error, data, isSuccess, revalidate: () => client.invalidateQueries(["WSSearchList", tenantId, filters, auth]) };

};
export default useMypaymentWS