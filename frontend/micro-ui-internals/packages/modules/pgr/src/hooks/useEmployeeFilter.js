import { useQuery } from "react-query";

const getEmployeeFilter = async (cityCode, roles) => {
  // const _roles = roles.join(",");

  const searchResponse = await Digit.PGRService.employeeSearch(cityCode, roles);
  console.log(searchResponse);
  const serviceDefs = Digit.SessionStorage.get("serviceDefs") || [];
  const complaintDetails = Digit.SessionStorage.get("complaintDetails");
  // const serviceCode = complaintDetails.service.serviceCode;
  const serviceCode = complaintDetails.audit.serviceCode;
  // const department = serviceDefs.find((def) => def.serviceCode === serviceCode).map((service) => service.department);
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

export const useEmployeeFilter = (cityCode, roles) => {
  const { isLoading, error, isError, data } = useQuery(["employeeFilter", cityCode, roles], async () => getEmployeeFilter(cityCode, roles));
  return { isLoading, error, isError, data };
};

export default useEmployeeFilter;
