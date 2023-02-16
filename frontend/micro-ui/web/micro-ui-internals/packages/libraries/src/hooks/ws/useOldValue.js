import { useQuery } from "react-query";
import { WSService } from "../../services/elements/WS";

const useOldValue = ({ tenantId, filters, businessService }, config = {}) => {
  return useQuery(
    ["WS_WATER_SEARCH", tenantId, filters, businessService],
    async () => await WSService.search({ tenantId, filters, businessService: businessService === "WATER" ? "WS" : "SW" }),
    {
      ...config,
    }
  );
};

export default useOldValue;
