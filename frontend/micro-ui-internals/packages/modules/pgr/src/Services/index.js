import { CoreService } from "@egovernments/digit-ui-libraries";
import { useQuery, useQueryClient } from "react-query";

let instances = 0;

class PGRBaseService extends CoreService {
  constructor() {
    super("PGR");
    console.log("instances--------------------->>>>>>>>", ++instances);
    this.customizations = {};
    this.moduleCode = "PGR";
    console.log("instances=====================$$$$$$$$$$$$$$$$$$$$$$$$$", this._locationService);
    this.getUserType = () => window.Digit?.SessionStorage.get("userType");
    this.getTenantId = () =>
      this.getUserType() == "CITIZEN" ? window.Digit.SessionStorage?.get("Citizen.tenantId") : window.Digit.SessionStorage?.get("Employee.tenantId");
  }

  getEmployeeForAssignment = async (cityCode, roles, complaintDetails) => {
    const searchReponse = await this.employeeSearch(cityCode, roles);
    const serviceDefs = await this._MdmsService.getServiceDefs(this.getTenantId(), this.moduleCode);
    const serviceCode = complaintDetails.audit.serviceCode;
    const department = serviceDefs.find((def) => def.serviceCode === serviceCode).department;
    const employees = searchReponse.Employees.filter((employee) =>
      employee.assignments.map((assignment) => assignment.department).includes(department)
    );
    return [
      {
        department: department,
        employees: employees.map((employee) => {
          return { uuid: employee.user.uuid, name: employee.user.name };
        }),
      },
    ];
  };

  fetchComplaintDetails = async (id) => {
    let tenantId = this.getTenantId();
    var serviceDefs = this._MdmsService.getServiceDefs(tenantId, this.moduleCode);
    const { service, workflow } = (await this._module.search(tenantId, { serviceRequestId: id })).ServiceWrappers[0] || {};
    Digit.SessionStorage.set("complaintDetails", { service, workflow });
    if (service && workflow && serviceDefs) {
      const ids = workflow.verificationDocuments
        ? workflow.verificationDocuments.filter((doc) => doc.documentType === "PHOTO").map((photo) => photo.fileStoreId || photo.id)
        : null;
      const thumbnails = ids ? await this._fileStorageService.getThumbnails(ids, tenantId) : null;
      const details = this.transformComplaintDetails({ id, service, workflow, thumbnails });
      return details;
    } else {
      console.log("error fetching complaint details or service defs");
      return {};
    }
  };

  transformComplaintDetails = ({ id, service, workflow, thumbnails }) => {
    const role = this.getUserType().toUpperCase();
    const customDetails = this.customizations?.getComplaintDetailsTableRows
      ? this.customizations?.getComplaintDetailsTableRows({ id, service, role })
      : {};
    return {
      details: !this.isEmptyOrNull(customDetails) ? customDetails : this.getDetailsRow({ id, service }),
      thumbnails: thumbnails,
      workflow: workflow,
      service,
      audit: {
        citizen: service.citizen,
        details: service.auditDetails,
        source: service.source,
        rating: service.rating,
        serviceCode: service.serviceCode,
      },
    };
  };

  getDetailsRow = ({ id, service }) => ({
    CS_COMPLAINT_DETAILS_COMPLAINT_NO: id,
    CS_COMPLAINT_DETAILS_APPLICATION_STATUS: `CS_COMMON_${service.applicationStatus}`,
    CS_ADDCOMPLAINT_COMPLAINT_TYPE: `SERVICEDEFS.${service.serviceCode.toUpperCase()}`,
    CS_COMPLAINT_FILED_DATE: Digit.DateUtils.ConvertTimestampToDate(service.auditDetails.createdTime),
    ES_CREATECOMPLAINT_ADDRESS: [
      service.address.landmark,
      service.address.locality.code.includes("_")
        ? service.address.locality.code.toUpperCase()
        : `PB_${service.address.city.toUpperCase()}_ADMIN_${service.address.locality.code}`,
      service.address.city,
    ],
  });

  useQuery = (func, [...args], config) => {
    const client = useQueryClient();
    if (args.length) {
      if (config?.cacheKey)
        return {
          ...useQuery([...args, config.cacheKey], () => func(...args), config),
          revalidate: () => client.invalidateQueries([...args, config.cacheKey]),
        };
      return { ...useQuery(args, () => func(...args), config), revalidate: () => client.invalidateQueries(args) };
    } else return { ...useQuery(config.cacheKey, () => func(), config), revalidate: () => client.invalidateQueries(config.cacheKey) };
  };

  getWorkFlowDetailsById = (id, role = "CITIZEN") => {
    let tenantId = this.getTenantId();
    let moduleCode = this.moduleCode;
    return this.useQuery(this._WorkFlowService.getDetailsById, [{ tenantId, id, moduleCode, role }]);
  };

  useFileUpload = (file) => {
    return this.useQuery(this._fileStorageService.Filestorage, [file], { enabled: file ? true : false });
  };

  getComplaintStatus = async (t) =>
    (await this._WorkFlowService.init(this.getTenantId())).BusinessServices[0].states
      .filter((state) => state.applicationStatus)
      .map((state) => ({
        name: t(`CS_COMMON_${state.applicationStatus}`),
        code: state.applicationStatus,
      }));
}

let service = new PGRBaseService();
export const usePGRService = () => service;
