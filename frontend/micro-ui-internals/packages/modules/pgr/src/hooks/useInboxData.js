import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
//import complaintData from "./dummyComplaintData.json"; // using dummy data as api pgr search api is down

const useInboxData = (searchParams, tenantId) => {
  console.log("searchParams--------:", searchParams);
  const state = useSelector((state) => state);
  const [complaintList, setcomplaintList] = useState([]);
  //let serviceReqIds = "";
  let serviceIds = [];
  let filters = { start: 1, end: 10, ...searchParams.filters, ...searchParams.search };
  useEffect(() => {
    let complaintDetailsResponse = null;
    let getComplaintResponse = async () => {
      complaintDetailsResponse = await Digit.PGRService.search(tenantId, filters);
      complaintDetailsResponse.ServiceWrappers.forEach((service) => serviceIds.push(service.service.serviceRequestId));
      const serviceIdParams = serviceIds.join();
      const workflowInstances = await Digit.workflowService.getByBusinessId(tenantId, serviceIdParams, filters, false);
      //console.log("serviceIdParams:", serviceIdParams, "workflowInstances:", workflowInstances);
      let combinedRes = combineResponses(complaintDetailsResponse, workflowInstances).map((data) => ({
        ...data,
        sla: Math.round(data.sla / (24 * 60 * 60 * 1000)),
      }));
      setcomplaintList(combinedRes);
    };
    getComplaintResponse();
  }, [searchParams]);
  return complaintList;
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
    locality: complaint.service.address.locality.code,
    status: complaint.service.applicationStatus,
    taskOwner: wfMap[complaint.service.serviceRequestId].assigner.name,
    sla: wfMap[complaint.service.serviceRequestId].businesssServiceSla,
  }));
};

export default useInboxData;
