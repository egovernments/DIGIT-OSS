import { useQuery } from "react-query";
import { PTService } from "../../services/elements/PT";

const useWaterPropertySearch = ({tenantId, filters = {}, BusinessService="WS", t}, config = {}) => {
    let propertyfilter = { propertyIds : filters?.propertyids,}
    if(filters?.propertyids !== "" && filters?.locality) propertyfilter.locality = filters?.locality;
    config={enabled:filters?.propertyids!==""?true:false}
    const { isLoading, error, data, isSuccess } = useQuery(['WSP_SEARCH', tenantId, propertyfilter,BusinessService], async () => await PTService.search({ tenantId, filters:propertyfilter, auth:filters?.locality?false:true })
  , config)
  
  return {isLoading,error, data, isSuccess, revalidate: () => client.invalidateQueries(["WSSearchList", tenantId, filters, auth]) };
}

export default useWaterPropertySearch;