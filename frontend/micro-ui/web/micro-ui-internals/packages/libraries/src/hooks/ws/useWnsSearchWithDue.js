import { useQuery } from "react-query";
import { WSService } from "../../services/elements/WS";
import { PTService } from "../../services/elements/PT";

const useWnsSearchWithDue = ({ tenantId, filters = {}, BusinessService = "WS", t }, config = {}) => {
  console.log("filters-> ", filters);
  console.log("tenantId-> ", tenantId);
  const { isLoading, error, data, isSuccess } = useQuery(
    ["WS_FETCH_BILL", tenantId, filters, BusinessService],
    async () =>
      await WSService.fetchPaymentDetails({
        tenantId: filters.tenantId,
        filters: { ...filters },
        consumerCode: filters.applicationNumber,
        businessService: BusinessService,
      }),
    config
  );
  return { isLoading, error, data, isSuccess };
};

export default useWnsSearchWithDue;
