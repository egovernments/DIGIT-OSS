import { useQuery } from "react-query";

const useEmployeeFilter = (cityCode, roles, complaintDetails) => {
  const [employeeDetails, setEmployeeDetails] = useState(null);

  const searchResponse = (async () => await Digit.PGRService.employeeSearch(cityCode, roles))();
  console.log(searchResponse);
  const serviceDefs = Digit.SessionStorage.get("serviceDefs") || [];
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

export const useEmployeeFilter = (cityCode, roles, complaintDetails) => {
  const { isLoading, error, isError, data } = useQuery(["employeeFilter", cityCode, roles], async () =>
    getEmployeeFilter(cityCode, roles, complaintDetails)
  );
  return { isLoading, error, isError, data };
};

export default useEmployeeFilter;
