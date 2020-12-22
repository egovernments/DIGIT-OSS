import CoreService from "@egovernments/digit-ui-libraries";
import { getServiceDefinitions } from "./ServiceDefinitions";

class EmployeeFilter extends CoreService {
  constructor() {
    super("PGR");
  }

  getEmployees = (cityCode, roles, complaintDetails) => {
    const tenantId = window.Digit.SessionStorage.get("Employee.tenantId");
    const searchResponse = (async () => await this._module.employeeSearch(cityCode, roles))();
    console.log(searchResponse);
    const serviceDefs = getServiceDefinitions.get(tenantId) || [];
    const serviceCode = complaintDetails.audit.serviceCode;
    const department = serviceDefs.find((def) => def.serviceCode === serviceCode).department;
    const employees = searchResponse.Employees.filter((employee) =>
      employee.assignments.map((assignment) => assignment.department).includes(department)
    );

    //emplpoyess data sholld only conatin name uuid dept
    return [
      {
        department: department,
        employees: employees.map((employee) => {
          return { uuid: employee.user.uuid, name: employee.user.name };
        }),
      },
    ];
  };
}

const employeeFilterObject = new EmployeeFilter();
export const getEmployeeFilter = () => employeeFilterObject;
