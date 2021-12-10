import { useQuery, useQueryClient } from "react-query";

const useMyPropertyPayments = ({ tenantId, filters, auth,searchedFrom="" }, config = {}) => {
  const client = useQueryClient();

  const paymentargs = tenantId ? { tenantId, filters, auth } : { filters, auth };


  const { isLoading, error, data } = useQuery(["paymentpropertySearchList", tenantId, filters, auth], () => Digit.PTService.paymentsearch(paymentargs), {
    ...config,
    });

return { isLoading, error, data, revalidate: () => client.invalidateQueries(["paymentpropertySearchList", tenantId, filters, auth]) };

};

export default useMyPropertyPayments;