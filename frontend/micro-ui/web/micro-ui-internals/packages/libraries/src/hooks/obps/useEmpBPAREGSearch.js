import { useQuery } from "react-query"

const convertMillisecondsToDays = (milliseconds) => {
    return Math.round(milliseconds / (1000 * 60 * 60 * 24));
  }
  
  const mapWfBybusinessId = (workflowData) => {
    return workflowData?.reduce((acc, item) => {
      acc[item?.businessId] = item;
      return acc;
    }, {})
  } 
  
  const combineResponse = (applications, workflowData, totalCount) => {
    const workflowInstances = mapWfBybusinessId(workflowData);
    return applications.map(application => ({
      ...application,
      assignee: workflowInstances[application?.applicationNumber]?.assignes?.[0]?.name,
      //sla: convertMillisecondsToDays(workflowInstances[application?.applicationNumber]?.businesssServiceSla),
      state: workflowInstances[application?.applicationNumber]?.state?.state,
      Count:totalCount,
    }))
  }

const useEmpBPAREGSearch = (tenantId, filters, params, config = {}) => {
  return useQuery(['BPA_REG_WORK_SEARCH', tenantId, filters, params], async () => {
    const response = await Digit.OBPSService.BPAREGSearch(tenantId, filters, params);
    const businessIds = response?.Licenses.map(application => application.applicationNumber);
    const workflowRes = await Digit.WorkflowService.getAllApplication(Digit.ULBService.getStateId(), { businessIds: businessIds.join()  });
    return combineResponse(response?.Licenses, workflowRes?.ProcessInstances, response?.Count);
  }, config);
}

export default useEmpBPAREGSearch;