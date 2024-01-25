import { useQuery, useQueryClient } from "react-query";

const useServiceSearchCF = ({ tenantId, filters }, config = {}) => {
  const client = useQueryClient();
  //removing servicedefids from search call as it's not required anymore
  // const searchargs = { filters : { ServiceDefinitionCriteria : {tenantId : filters?.serviceSearchArgs?.tenantId, module:filters?.serviceSearchArgs?.module, code:filters?.serviceSearchArgs?.code  }}};


  // const { isLoading, error, data } = useQuery(["ServiceDefinitionSearch", tenantId, filters], () => Digit.PTService.cfdefinitionsearch(searchargs), {
  //   ...config,
  //   });

let serviceSearchArg = {filters : {ServiceCriteria : {tenantId:filters?.serviceSearchArgs?.tenantId, /*serviceDefIds: [data?.ServiceDefinition?.[0]?.id]["ca134821-97f0-42b7-a53d-f6cd2796e4b9"],attributes:filters?.serviceSearchArgs?.attributes*/ referenceIds:filters?.serviceSearchArgs?.referenceIds}}}
let serviceconfig = {/*enabled : data?.ServiceDefinition?.[0]?.id ? true : false,*/...config, cacheTime: 0}

const { isLoading : serviceLoading, error : serviceerror, data :servicedata} = useQuery(["ServiceSearch", tenantId, filters], () => Digit.PTService.cfsearch(serviceSearchArg), {
    ...serviceconfig,
    });


return {isLoading: serviceLoading, error : serviceerror, data : servicedata, revalidate: () => client.invalidateQueries(["ServiceSearch", tenantId, filters]) };

};

export default useServiceSearchCF;