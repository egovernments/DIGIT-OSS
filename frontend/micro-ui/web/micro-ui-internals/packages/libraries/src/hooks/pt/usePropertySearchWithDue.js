import { useQuery, useQueryClient } from "react-query";

const usePropertySearchWithDue = ({ tenantId, filters, auth = true, configs }) => {
  const client = useQueryClient();
  const defaultSelect = (data) => {
    let consumerCodes = [];
    data.Properties.map((property) => {
      property.status == "ACTIVE" && consumerCodes.push(property.propertyId);
      property.units = property?.units?.filter((unit) => unit.active);
      property.owners = property?.owners?.filter((owner) => owner.status === "ACTIVE");
    });
    data["ConsumerCodes"] = consumerCodes;
    return data;
  };

  const { isLoading, error, data } = useQuery(
    ["propertySearchList", tenantId, filters, auth],
    () => configs.enabled && Digit.PTService.search({ tenantId, filters, auth: true }),
    {
      select: defaultSelect,
    },
    configs
  );
  let consumerCodes = data?.ConsumerCodes?.join(",") || "";
  const { isLoading: billLoading, data: billData, isSuccess } = useQuery(
    ["propertySearchBillList", tenantId, filters, auth, consumerCodes],
    () => configs.enabled && data && Digit.PTService.fetchPaymentDetails({ tenantId, consumerCodes, auth: true }),
    {
      select: (billResp) => {
        data["Bill"] = billResp?.Bill?.reduce((curr, acc) => {
            curr[acc?.consumerCode] = acc?.totalAmount;
            return curr;
          }, {}) || {};
        return billResp;
        }
    },
    configs
  );
  console.log(billData,data,"billData");
  return {
    isLoading: isLoading || billLoading,
    error,
    data,
    billData,
    isSuccess,
    revalidate: () => {
      client.invalidateQueries(["propertySearchBillList", tenantId, filters, auth]);
      client.invalidateQueries(["propertySearchList", tenantId, filters, auth]);
    },
  };
};

export default usePropertySearchWithDue;
