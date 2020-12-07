import { set } from "lodash";
import React, { useState, useEffect } from "react";

const useEmployeeFilter = (cityCode, roles) => {
  const [employeeDetails, setEmployeeDetails] = useState(null);

  useEffect(async () => {
    const _roles = roles.join(",");
    const searchResponse = await Digit.PGRService.employeeSearch(cityCode, _roles);

    const serviceDefs = Digit.SessionStorage.get("serviceDefs");
    const complaintDetails = Digit.SessionStorage.get("complaintDetails");
    const serviceCode = complaintDetails.service.serviceCode;
    const department = serviceDefs.filter((def) => def.serviceCode === serviceCode).map((service) => service.department)[0];
    const employees = searchResponse.Employees.filter((employee) =>
      employee.assignments.map((assignment) => assignment.department).includes(department)
    );

    console.log("useEMployeefilter", employees);
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
