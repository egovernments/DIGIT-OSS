import { useQuery, useQueryClient } from "react-query";

const usePropertySearchWithDue = ({ tenantId, filters, auth = true, configs }) => {
  const client = useQueryClient();

  const getOwnerNames = (propertyData) => {
    const getActiveOwners = propertyData?.owners?.filter(owner => owner?.active);
    const getOwnersList = getActiveOwners?.map(activeOwner => activeOwner?.name)?.join(",");
    return getOwnersList;
  }

  const defaultSelect = (data) => {
    let consumerCodes = [];
    let formattedData = {};
    data.Properties.map((property) => {
      property.status == "ACTIVE" && consumerCodes.push(property.propertyId);
      property.units = property?.units?.filter((unit) => unit.active);
      property.owners = property?.owners?.filter((owner) =>
        (owner.status === property?.status) === "INWORKFLOW" && property?.creationReason === "MUTATION" ? "INACTIVE" : "ACTIVE"
      );
      formattedData[property.propertyId] = {
        propertyId: property?.propertyId,
        name: property?.owners?.[0].name,
        status: property?.status,
        due: false,
        locality: `${property?.tenantId?.replace(".", "_")?.toUpperCase()}_REVENUE_${property?.address?.locality?.code}`,
        owners: property?.owners,
        documents: property?.documents,
        ownerNames: getOwnerNames(property)
      };
    });
    data["ConsumerCodes"] = consumerCodes;
    data["FormattedData"] = formattedData;
    return data;
  };

  const { isLoading, error, data } = useQuery(
    ["propertySearchList", tenantId, filters, auth],
    () => configs.enabled && Digit.PTService.search({ tenantId, filters, auth: auth }),
    {...configs,
      select: defaultSelect,
    }
  );
  let consumerCodes = data?.ConsumerCodes?.join(",") || "";
  const { isLoading: billLoading, data: billData, isSuccess } = useQuery(
    ["propertySearchBillList", tenantId, filters, data, auth, consumerCodes],
    () => configs.enabled && data && Digit.PTService.fetchPaymentDetails({ tenantId, consumerCodes, auth: auth }),
    {...configs,
      select: (billResp) => {
        data["Bill"] =
          billResp?.Bill?.reduce((curr, acc) => {
            curr[acc?.consumerCode] = acc?.totalAmount;
            data["FormattedData"][acc?.consumerCode]["due"] = acc?.totalAmount;
            return curr;
          }, {}) || {};
        return billResp;
      },
    }
  );
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
