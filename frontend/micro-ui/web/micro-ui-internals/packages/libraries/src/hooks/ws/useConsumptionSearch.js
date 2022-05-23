import { useQuery } from "react-query";
import { WSService } from "../../services/elements/WS";

  
const useConsumptionSearch = ({tenantId, filters = {}, BusinessService="WS", t}, config = {}) => {
  const { isLoading, error, data, isSuccess } =  useQuery(['WS_SEARCH', tenantId, filters, BusinessService], async () => await WSService.consumptionSearch({tenantId, filters: { ...filters }, businessService:BusinessService})
  , config)
  return { isLoading, error, data, isSuccess };
}

export default useConsumptionSearch;