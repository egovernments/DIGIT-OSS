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
  
  const combineResponse = (applications, workflowData) => {
    const workflowInstances = mapWfBybusinessId(workflowData);
    console.log(applications,"applications");
    return applications.map(application => ({
      ...application,
      assignee: workflowInstances[application?.applicationNumber]?.assignes?.[0]?.name,
      //sla: convertMillisecondsToDays(workflowInstances[application?.applicationNumber]?.businesssServiceSla),
      state: workflowInstances[application?.applicationNumber]?.state?.state
    }))
  }

const useEmpBPAREGSearch = (tenantId, filters, params, config = {}) => {
    console.log("inside EMP BPAREG search");
  return useQuery(['BPA_REG_WORK_SEARCH', tenantId, filters, params], async () => {
    const userInfo = Digit.UserService.getUser();
    const response = await Digit.OBPSService.BPAREGSearch(tenantId, filters, params);
    console.log(response,"response");
    const businessIds = response?.Licenses.map(application => application.applicationNumber);
    console.log(businessIds,"businessIds");
    const workflowRes = await Digit.WorkflowService.getAllApplication('pb', { businessIds: businessIds.join()  });
    return combineResponse(response?.Licenses, workflowRes?.ProcessInstances);
  }, config);
}

export default useEmpBPAREGSearch;