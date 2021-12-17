import { useQuery, useQueryClient } from "react-query";

const useMyPropertyPayments = ({ tenantId, filters, searchedFrom="" }, config = {}) => {
  const client = useQueryClient();

  const paymentargs = tenantId ? { tenantId, filters } : { filters };


  const { isLoading, error, data } = useQuery(["paymentpropertySearchList", tenantId, filters], () => Digit.PTService.paymentsearch(paymentargs), {
    ...config,
    });

return { isLoading, error, data, revalidate: () => client.invalidateQueries(["paymentpropertySearchList", tenantId, filters]) };

};

export default useMyPropertyPayments;