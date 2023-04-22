import { useQuery,useQueryClient } from "react-query";
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
    sla: application?.status.match(/^(APPROVED)$/) ? "CS_NA" : convertMillisecondsToDays(workflowInstances[application?.applicationNo].businesssServiceSla),
    state: workflowInstances[application?.applicationNo]?.state?.state,
    action: workflowInstances[application?.applicationNo]?.action
  }))
}

const useBPASearch = (tenantId, filters = {}, config = {}) => {
  if (window.location.href.includes("search/application")) {
    if (!filters?.limit) filters.limit = 10;
    if (!filters?.offset) filters.offset = 0;
  }

  const userInfos = sessionStorage.getItem("Digit.citizen.userRequestObject");
  const userInfo = userInfos ? JSON.parse(userInfos) : {};
  const userInformation = userInfo?.value?.info;

  if (window.location.href.includes("/citizen") && window.location.href.includes("/search")) {
    if (!filters?.createdBy && !window.location.href.includes("obps-application")) filters.createdBy = userInformation?.uuid;
    if (!filters?.applicationType) filters.applicationType = "BUILDING_PLAN_SCRUTINY";
    if (!filters?.serviceType) filters.serviceType = "NEW_CONSTRUCTION";
  }

  if (window.location.href.includes("/search/obps-application")) filters.mobileNumber = userInformation?.mobileNumber;
  
  const client = useQueryClient();
  return {...useQuery(['BPA_SEARCH', tenantId, filters], async () => {
    const response = await OBPSService.BPASearch(tenantId, { ...filters });
    let tenantMap = {}, processInstanceArray = [], appNumbers = [];
    response?.BPA?.forEach(item => {
      var appNums = tenantMap[item.tenantId] || [];
      appNumbers = appNums;
      appNums.push(item.applicationNo);
      tenantMap[item.tenantId] = appNums;
      item["Count"] = response?.Count;
    });

    for (var key in tenantMap) {
      for (let i = 0; i < appNumbers.length / 100; i++) {
        try {
          let payload = await Digit.WorkflowService.getAllApplication(key, { businessIds: tenantMap[key]?.slice(i * 100, (i * 100) + 100)?.join()  });
          processInstanceArray = processInstanceArray.concat(payload.ProcessInstances)
        } catch (error) {
          return [];
        }
      }
      processInstanceArray = processInstanceArray.filter(record => record.moduleName.includes("bpa-services"));
    }
    return combineResponse(response?.BPA, processInstanceArray);
  }, config),revalidate: () => client.removeQueries(['BPA_SEARCH', tenantId, filters])}
}

export default useBPASearch;
