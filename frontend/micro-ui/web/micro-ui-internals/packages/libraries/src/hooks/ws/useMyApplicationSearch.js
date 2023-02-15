import { useQuery, useQueryClient } from "react-query";
import { WSService } from "../../services/elements/WS";
import { PTService } from "../../services/elements/PT";
import cloneDeep from "lodash/cloneDeep";
  
const useMyApplicationSearch = ({tenantId, filters = {}, BusinessService="WS", t}, config = {}, getWorkflow = false) => {
  const client = useQueryClient();

  const { isLoading, error, data, isSuccess } =  useQuery(['WS_SEARCH', tenantId, filters, BusinessService, config], async () => await WSService.search({tenantId, filters: { ...filters }, businessService:BusinessService})
  , {
    ...config,
    refetchOnMount: "always"
  });

  const user = Digit.UserService.getUser();
  const tenant = Digit.SessionStorage.get("CITIZEN.COMMON.HOME.CITY")?.code || user?.info?.permanentCity || Digit.ULBService.getCurrentTenantId();

  const { isLoading : isWSLoading , error : isWSError, data : wsData, isSuccess: wsSuccess } =  useQuery(['WS_SEARCH_CONNECTION', tenant, BusinessService, data, config], async () => await WSService.search({tenantId : tenant, filters: 
    isSuccess && data?.WaterConnection ? 
    { 
      connectionNumber : data?.WaterConnection?.[0]?.connectionNo  
    } 
    : 
    {
      connectionNumber : data?.SewerageConnections?.[0]?.connectionNo
    }
    , businessService:BusinessService})
  , {
    enabled: isSuccess && getWorkflow,
    refetchOnMount: "always"
  })

  let businessIds = [];

  if( !isWSLoading && wsSuccess){
    const wsResponseForWorkflowData = cloneDeep(data?.WaterConnection ? wsData?.WaterConnection : wsData?.SewerageConnections);
    wsResponseForWorkflowData?.forEach((item) => {
      item?.applicationNo &&  businessIds.push(item?.applicationNo);
    });
  }
  else{}
  const { isLoading: isWorkflowLoading, data: workflowData } =  useQuery(['WS_SEARCH_WROKFLOW', tenant, wsData], async () => await Digit.WorkflowService.getByBusinessId(tenant, businessIds.join(",")), 
  {
    enabled: isSuccess && getWorkflow && wsSuccess,
    select: (data) => {
      let isApplicationApproved = false
      if(data?.ProcessInstances.length > 0){
        isApplicationApproved = data?.ProcessInstances?.[0]?.state?.isTerminateState
        return {
          checkWorkFlow : isApplicationApproved
        };
      }
      return {
        checkWorkFlow : isApplicationApproved
      };
    }
  } );
  return { 
    isLoading : !getWorkflow ? isLoading : isLoading || isWSLoading || isWorkflowLoading , 
    error, 
    data : !getWorkflow ? data : {...data, ...workflowData}, 
    isSuccess,
    revalidate: () => client.invalidateQueries(["WS_SEARCH", tenantId, filters, BusinessService, config])
  };
    


}

export default useMyApplicationSearch;