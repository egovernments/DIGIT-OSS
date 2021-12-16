import { useQuery, useQueryClient } from "react-query";
import { Search } from "../../services/molecules/FSM/Search";

const useInbox = (tenantId, filters, filterFsmFn, workFlowConfig = {}) => {
  let { uuid } = Digit.UserService.getUser().info;

  const client = useQueryClient();

  const fetchFilters = () => {
    let filtersObj = {};
    const { applicationNos, mobileNumber, limit, offset, sortBy, sortOrder, total } = filters;
    if (filters.applicationStatus && filters.applicationStatus?.[0]) {
      filtersObj.applicationStatus = filters.applicationStatus.map((status) => status.code).join(",");
    }
    if (filters.locality) {
      filtersObj.locality = filters.locality.map((item) => item.code.split("_").pop()).join(",");
    }
    if (filters.uuid && Object.keys(filters.uuid).length > 0) {
      filtersObj.assignee = filters.uuid.code === "ASSIGNED_TO_ME" ? uuid : "";
    }
    if (mobileNumber) {
      filtersObj.mobileNumber = mobileNumber;
    }
    if (applicationNos) {
      filtersObj.applicationNos = applicationNos;
    }
    if (sortBy) {
      filtersObj.sortBy = sortBy;
    }
    if (sortOrder) {
      filtersObj.sortOrder = sortOrder;
    }
    if (!total) return { limit, offset, sortBy, sortOrder, ...filtersObj };
    else return { limit: 100000, offset: 0, sortBy, sortOrder, ...filtersObj };
  };

  const workflowFilters = fetchFilters().assignee ? { assignee: uuid } : {};
  const workFlowInstances = useQuery(
    ["WORKFLOW", workflowFilters],
    () => Digit.WorkflowService.getAllApplication(tenantId, { ...workflowFilters, businesssService: "FSM" }),
    { ...workFlowConfig, select: (data) => data.ProcessInstances }
  );

  const { data: processInstances, isLoading: workflowLoading, isFetching: wfFetching, isSuccess: wfSuccess } = workFlowInstances;
  let applicationNos = !wfFetching && wfSuccess ? { applicationNos: processInstances.map((e) => e.businessId).join() } : {};
  applicationNos = applicationNos?.applicationNos === "" ? { applicationNos: "xyz" } : applicationNos;

  if (!filterFsmFn)
    filterFsmFn = (data) => {
      const fsm = data.fsm
        .filter((application) => processInstances.find((wfApp) => wfApp.businessId === application.applicationNo))
        .map((e) => ({ ...e, totalCount: data.totalCount }));
      return combineResponses(fsm, processInstances);
    };

  const appList = useQuery(
    [
      "FSM_SEARCH",
      { ...fetchFilters(), applicationNos: fetchFilters().applicationNos ? fetchFilters().applicationNos : applicationNos.applicationNos },
    ],
    () =>
      Search.all(tenantId, {
        ...fetchFilters(),
        applicationNos: fetchFilters().applicationNos ? fetchFilters().applicationNos : applicationNos.applicationNos,
      }),
    {
      enabled: !wfFetching && wfSuccess,
      select: filterFsmFn,
    }
  );

  const revalidate = () => {
    client.refetchQueries(["WORKFLOW"]);
    client.refetchQueries(["FSM_SEARCH"]);
  };

  client.setQueryData("FUNCTION_RESET_INBOX", { revalidate });

  return {
    ...appList,
    revalidate,
  };
};

const mapWfBybusinessId = (wfs) => {
  return wfs.reduce((object, item) => {
    return { ...object, [item["businessId"]]: item };
  }, {});
};

const combineResponses = (applicationDetails, workflowInstances) => {
  let wfMap = mapWfBybusinessId(workflowInstances);
  const response = applicationDetails.map((application) => ({
    applicationNo: application.applicationNo,
    createdTime: new Date(application.auditDetails.createdTime),
    locality: application.address.locality.code,
    status: application.applicationStatus,
    taskOwner: wfMap[application.applicationNo]?.assigner?.name,
    sla: Math.round(wfMap[application.applicationNo]?.businesssServiceSla / (24 * 60 * 60 * 1000)) || "-",
    mathsla: wfMap[application.applicationNo]?.businesssServiceSla,
    tenantId: application.tenantId,
    totalCount: application.totalCount,
  }));

  return response;
};

export default useInbox;
