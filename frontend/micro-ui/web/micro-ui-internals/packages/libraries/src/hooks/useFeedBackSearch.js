import { useQuery, useQueryClient } from "react-query";

const useFeedBackSearch = ({ tenantId, filters }, config = {}) => {
    const client = useQueryClient();
  
  let serviceSearchArg = {filters : {ServiceCriteria : {tenantId:filters?.serviceSearchArgs?.tenantId, referenceIds:filters?.serviceSearchArgs?.referenceIds}}}
  let serviceconfig = {/*enabled : data?.ServiceDefinition?.[0]?.id ? true : false,*/ cacheTime: 0}
  
  const { isLoading : serviceLoading, error : serviceerror, data :servicedata} = useQuery(["ServiceSearch", tenantId, filters], () => Digit.PTService.cfsearch(serviceSearchArg), {
      ...serviceconfig,
      });
  
  
  return {isLoading: serviceLoading, error : serviceerror, data : servicedata, revalidate: () => client.invalidateQueries(["ServiceSearch", tenantId, filters]) };

};

export default useFeedBackSearch;