import { useQuery } from "react-query";
import { OBPSService } from "../../services/elements/OBPS";

// @ayan-egov TODO: use inbox api wrapper raise requirement

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
  return applications.map(application => ({
    ...application,
    assignee: workflowInstances[application?.applicationNo]?.assignes?.[0]?.name,
    sla: convertMillisecondsToDays(workflowInstances[application?.applicationNo].businesssServiceSla),
    state: workflowInstances[application?.applicationNo]?.state?.state
  }))
}

const useBPASearch = (tenantId, filters = {}, config = {}) => {
  return useQuery(['BPA_SEARCH', tenantId, filters], async () => {
    const userInfo = Digit.UserService.getUser();
    const response = await OBPSService.BPASearch(tenantId, { ...filters, requestor: userInfo?.info?.mobileNumber });
    const businessIds = response?.BPA.map(application => application.applicationNo);
    const workflowRes = await Digit.WorkflowService.getAllApplication('pb.amritsar', { businessIds: businessIds.join()  });
    return combineResponse(response?.BPA, workflowRes?.ProcessInstances);
  }, config)
}

export default useBPASearch;
