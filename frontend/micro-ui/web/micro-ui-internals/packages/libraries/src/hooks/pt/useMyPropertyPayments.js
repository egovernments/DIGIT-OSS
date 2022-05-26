import { useQuery, useQueryClient } from "react-query";

const getOwnerForPayments = (propertyData,data) => {
  let newPayments = [];
  data && data?.Payments?.map((payment) => {
    let owner = propertyData?.filter((ob) => ob.propertyId === payment?.paymentDetails?.[0]?.bill?.consumerCode)[0]?.owners;
    newPayments.push({...payment,owners:owner});
  })
  data ? data["Payments"] = [...newPayments] : "";
  return data;
}

const useMyPropertyPayments = ({ tenantId, filters, searchedFrom="" }, config = {}) => {
  const client = useQueryClient();

  const paymentargs = tenantId ? { tenantId, filters } : { filters };


  const { isLoading, error, data } = useQuery(["paymentpropertySearchList", tenantId, filters], () => Digit.PTService.paymentsearch(paymentargs), {
    ...config,
    });
  let updatedData = getOwnerForPayments(config?.propertyData,data);

return { isLoading, error, data, revalidate: () => client.invalidateQueries(["paymentpropertySearchList", tenantId, filters]) };

};

export default useMyPropertyPayments;