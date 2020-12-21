import { CoreService } from "@egovernments/digit-ui-libraries";
import { useQuery, useQueryClient } from "react-query";

let instances = 0;

class PGRBaseService extends CoreService {
  constructor() {
    super("PGR");
    console.log("instances--------------------->>>>>>>>", ++instances);
    this.moduleCode = "PGR";

    this.getUserType = () => window.Digit?.SessionStorage.get("userType");
    this.getTenantId = () =>
      this.getUserType() == "CITIZEN" ? window.Digit.SessionStorage?.get("Citizen.tenantId") : window.Digit.SessionStorage?.get("Employee.tenantId");
  }

  getEmployeeForAssignment = async (cityCode, roles, complaintDetails) => {
    const searchReponse = await this.employeeSearch(cityCode, roles);
    const serviceDefs = await this.MdmsService.getServiceDefs(this.getTenantId(), this.moduleCode);
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

  useQuery = (func, [...args], config) => {
    const client = useQueryClient();
    return { ...useQuery(args, () => func(...args), config), revalidate: () => client.invalidateQueries(args) };
  };

  useFileUpload = (file) => {
    return this.useQuery(this.fileStorageService.Filestorage, [file], { enabled: file ? true : false });
  };
}

let service = new PGRBaseService();
export const usePGRService = () => service;
