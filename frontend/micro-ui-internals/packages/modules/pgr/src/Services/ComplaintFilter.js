import { CoreService } from "@egovernments/digit-ui-libraries";

class ComplaintFilter extends CoreService {
  constructor() {
    super("PGR");
    this.serviceIds = [];
  }

  getComplaintResponse = async (filters) => {
    const tenantId = window.Digit.SessionStorage.get("Employee.tenantId");
    let complaintDetailsResponse = await this._module.search(tenantId, filters);
    console.log("complaintDetailsResponse", complaintDetailsResponse, filters);
    complaintDetailsResponse.ServiceWrappers.forEach((service) => this.serviceIds.push(service.service.serviceRequestId));
    const serviceIdParams = this.serviceIds.join();
    const workflowInstances = await this._WorkFlowService.getByBusinessId(tenantId, serviceIdParams, filters, false);
    //console.log("serviceIdParams:", serviceIdParams, "workflowInstances:", workflowInstances);
    return this.combineResponses(complaintDetailsResponse, workflowInstances).map((data) => ({
      ...data,
      sla: Math.round(data.sla / (24 * 60 * 60 * 1000)),
    }));
  };

  mapWfBybusinessId = (wfs) => {
    return wfs.reduce((object, item) => {
      return { ...object, [item["businessId"]]: item };
    }, {});
  };

  combineResponses = (complaintDetailsResponse, workflowInstances) => {
    let wfMap = this.mapWfBybusinessId(workflowInstances.ProcessInstances);
    return complaintDetailsResponse.ServiceWrappers.map((complaint) => ({
      serviceRequestId: complaint.service.serviceRequestId,
      complaintSubType: complaint.service.serviceCode,
      locality: complaint.service.address.locality.code,
      status: complaint.service.applicationStatus,
      taskOwner: wfMap[complaint.service.serviceRequestId]?.assigner.name,
      sla: wfMap[complaint.service.serviceRequestId]?.businesssServiceSla,
    }));
  };
}

const ComplaintFilterObject = new ComplaintFilter();

export const getComplaintFilter = () => ComplaintFilterObject;
