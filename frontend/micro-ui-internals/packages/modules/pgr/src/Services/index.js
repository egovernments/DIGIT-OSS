import { CoreService } from "@egovernments/digit-ui-libraries/src";
import { useQuery, useQueryClient } from "react-query";

class PGRBaseService extends CoreService {
  constructor() {
    // this.coreService = coreService;
    super();
    this.moduleCode = "PGR";
    this.userType = Digit.SessionStorage.get("userType");
    this.tenantId = userType == "CITIZEN" ? Digit.SessionStorage.get("Citizen.tenantId") : Digit.SessionStorage.get("Employee.tenantId");
  }

  search = (stateCode = "pb", filters = {}) => {
    console.log("----------------------------", filters);
    return this.coreService.Request({
      url: Urls.pgr_search,
      useCache: false,
      method: "POST",
      auth: true,
      userService: true,
      params: { tenantId: stateCode, ...filters },
    });
  };

  create = (details, stateCode = "pb") =>
    this.coreService.Request({
      url: Urls.PGR_Create,
      data: details,
      useCache: true,
      userInfo: true,
      method: "POST",
      params: { tenantId: stateCode },
      auth: true,
    });

  update = (details, stateCode = "pb") =>
    this.coreService.Request({
      url: Urls.pgr_update,
      data: details,
      useCache: true,
      auth: true,
      method: "POST",
      params: { tenantId: stateCode },
    });

  count = (details, stateCode = "pb") =>
    this.coreService.Request({
      url: Urls.MDMS,
      data: details,
      useCache: true,
      method: "POST",
      params: { tenantId: stateCode },
    });

  inboxFilter = (params = {}, details = {}, stateCode = "pb") => {
    return this.coreService.Request({
      // url: "https://run.mocky.io/v3/597a50a0-90e5-4a45-b82e-8a2186b760bd",
      url: "https://run.mocky.io/v3/4334951e-c395-4ffa-91c1-203be5b0e0ff",
      data: details,
      useCache: true,
      params: { tenantId: stateCode, ...params.params },
    });
  };

  getEmployeeForAssignment = async (cityCode, roles, complaintDetails) => {
    const searchReponse = await this.coreService.employeeSearch(cityCode, roles);
    const serviceDefs = await this.coreService.MdmsService.getServiceDefs(this.tenantId, this.moduleCode);
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

  getEmployeeForAssignmentHooks = (cityCode, roles, complaintDetails) => {
    const client = useQueryClient();
    const { isLoading, data, error } = useQuery([cityCode, roles, complaintDetails], () =>
      getEmployeeForAssignment(cityCode, roles, complaintDetails)
    );
    return { isLoading, data, error, revalidate: () => client.invalidateQueries([cityCode, roles, complaintDetails]) };
  };
}

export const basePGRobj = new PGRBaseService();
