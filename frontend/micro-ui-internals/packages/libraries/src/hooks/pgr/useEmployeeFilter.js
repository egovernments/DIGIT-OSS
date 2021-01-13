import React, { useState, useEffect } from "react";

const useEmployeeFilter = (tenantId, roles, complaintDetails) => {
  const [employeeDetails, setEmployeeDetails] = useState(null);

  useEffect(async () => {
    // const _roles = roles.join(",");
    const searchResponse = await Digit.PGRService.employeeSearch(tenantId, roles);

    const serviceDefs = await Digit.MDMSService.getServiceDefs(tenantId, "PGR");
    const serviceCode = complaintDetails.service.serviceCode;
    const service = serviceDefs?.find((def) => def.serviceCode === serviceCode);
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
  }, [tenantId, roles]);

  return employeeDetails;
};

export default useEmployeeFilter;
