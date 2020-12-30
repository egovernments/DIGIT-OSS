import React, { useState, useEffect } from "react";

const useEmployeeFilter = (cityCode, roles, complaintDetails) => {
  const [employeeDetails, setEmployeeDetails] = useState(null);

  useEffect(async () => {
    // const _roles = roles.join(",");
    const searchResponse = await Digit.PGRService.employeeSearch(cityCode, roles);

    const serviceDefs = Digit.SessionStorage.get("serviceDefs");
    const serviceCode = complaintDetails.service.serviceCode;
    const service = serviceDefs.find((def) => def.serviceCode === serviceCode);
    const department = service?.department;
    const employees = searchResponse.Employees.filter((employee) =>
      employee.assignments.map((assignment) => assignment.department).includes(department)
    );

    console.log("useEMployeefilter", employees, searchResponse);
    //emplpoyess data sholld only conatin name uuid dept
    setEmployeeDetails([
      {
        department: department,
        employees: employees.map((employee) => {
          return { uuid: employee.user.uuid, name: employee.user.name };
        }),
      },
    ]);
  }, [cityCode, roles]);

  return employeeDetails;
};

export default useEmployeeFilter;
