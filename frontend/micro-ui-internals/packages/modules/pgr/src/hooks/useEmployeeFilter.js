import { useQuery } from "react-query";
import getEmployeeFilter from "../Services/EmployeeFilter";

const useEmployeeFilter = (cityCode, roles, complaintDetails) => {
  const { isLoading, error, isError, data } = useQuery(["employeeFilter", cityCode, roles], async () =>
    getEmployeeFilter.getEmployees(cityCode, roles, complaintDetails)
  );
  return { isLoading, error, isError, data };
};

export default useEmployeeFilter;
