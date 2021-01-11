import { useQuery, useQueryClient } from "react-query";

const useInboxData = (searchParams) => {
  const client = useQueryClient();
  // const [complaintList, setcomplaintList] = useState([]);
  // const user = Digit.UserService.getUser();
  // const tenantId = user?.info?.tenantId;

  const fetchInboxData = async () => {
    const tenantId = Digit.ULBService.getCurrentTenantId();
    let serviceIds = [];
    let commonFilters = { start: 1, end: 10 };
    let appFilters = { ...commonFilters, ...searchParams.filters.pgrQuery, ...searchParams.search };
    let wfFilters = { ...commonFilters, ...searchParams.filters.wfQuery };
    let complaintDetailsResponse = null;
    let combinedRes = [];
    complaintDetailsResponse = await Digit.PGRService.search(tenantId, appFilters);
    complaintDetailsResponse.ServiceWrappers.forEach((service) => serviceIds.push(service.service.serviceRequestId));
    const serviceIdParams = serviceIds.join();
    const workflowInstances = await Digit.WorkflowService.getByBusinessId(tenantId, serviceIdParams, wfFilters, false);
    if (workflowInstances.ProcessInstances.length) {
      combinedRes = combineResponses(complaintDetailsResponse, workflowInstances).map((data) => ({
        ...data,
        sla: Math.round(data.sla / (24 * 60 * 60 * 1000)),
      }));
    }
    return combinedRes;
  };

  const result = useQuery(["fetchInboxData", searchParams], fetchInboxData, { staleTime: Infinity });
  return { ...result, revalidate: () => client.refetchQueries(["fetchInboxData"]) };
};

const mapWfBybusinessId = (wfs) => {
  return wfs.reduce((object, item) => {
    return { ...object, [item["businessId"]]: item };
  }, {});
};

const combineResponses = (complaintDetailsResponse, workflowInstances) => {
  let wfMap = mapWfBybusinessId(workflowInstances.ProcessInstances);
  return complaintDetailsResponse.ServiceWrappers.map((complaint) => ({
    serviceRequestId: complaint.service.serviceRequestId,
    complaintSubType: complaint.service.serviceCode,
    locality: complaint.service.address.locality.code,
    status: complaint.service.applicationStatus,
    taskOwner: wfMap[complaint.service.serviceRequestId]?.assigner?.name,
    sla: wfMap[complaint.service.serviceRequestId]?.businesssServiceSla,
  }));
};

export default useInboxData;
