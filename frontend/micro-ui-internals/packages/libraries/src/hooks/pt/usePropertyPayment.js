import { useQuery, useQueryClient } from "react-query";

const usePropertyPayment = ({ tenantId, consumerCodes }) => {
  const client = useQueryClient();
  const { isLoading, error, data } = useQuery(
    ["propertyPaymentList", tenantId, consumerCodes],
    () => Digit.PTService.fetchPaymentDetails({ tenantId, consumerCodes }),
    {}
  );
  return { isLoading, error, data, revalidate: () => client.invalidateQueries(["propertyPaymentList", tenantId, consumerCodes]) };
};

export default usePropertyPayment;
