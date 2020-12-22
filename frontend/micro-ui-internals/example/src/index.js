import React from "react";
import ReactDOM from "react-dom";

import { initLibraries } from "@egovernments/digit-ui-libraries";
import { DigitUI } from "@egovernments/digit-ui-module-core";
// import { PGRModule, PGRLinks } from "@egovernments/digit-ui-module-pgr";
// import { Body, TopBar } from "@egovernments/digit-ui-react-components";
import "@egovernments/digit-ui-css/example/index.css";

import CITIZEN from "./userInfo/citizen.json";
import EMPLOYEE from "./userInfo/employee.json";
import LME from "./userInfo/lme.json";
import GRO from "./userInfo/gro.json";
import { pgrService } from "@egovernments/digit-ui-module-pgr";

import pgrCustomizations from "./pgr";

const userInfo = { CITIZEN, EMPLOYEE, LME, GRO };
initLibraries();

pgrService.customizations = pgrCustomizations;

window.Digit.Customizations = { PGR: pgrCustomizations };

// const userType = process.env.REACT_APP_USER_TYPE || "CITIZEN";

// const token = window.localStorage.getItem("token") || process.env[`REACT_APP_${userType}_TOKEN`];

//HOTFIX TOKEN

const userType = "EMPLOYEE";

const token = "2e1d6975-1884-4323-acc4-7a9a262c76a2";

// COMMENT ABOVE BEFORE COMMIT OR PUSH OR DEPLOY

const citizenInfo = window.localStorage.getItem("Citizen.user-info") || userInfo[userType];
const citizenTenantId = window.localStorage.getItem("Citizen.tenant-id") || "pb";

const employeeInfo = window.localStorage.getItem("Employee.user-info") || userInfo[userType];
const employeeTenantId = window.localStorage.getItem("Employee.tenant-id") || "pb.amritsar";

const userTypeInfo = userType === "CITIZEN" ? "citizen" : "employee";
window.Digit.SessionStorage.set("user_type", userTypeInfo);
window.Digit.SessionStorage.set("userType", userTypeInfo);

const userDetails = { token, info: userType === "CITIZEN" ? citizenInfo : employeeInfo };

window.Digit.SessionStorage.set("User", userDetails);

window.Digit.SessionStorage.set("Citizen.tenantId", citizenTenantId);
window.Digit.SessionStorage.set("Employee.tenantId", employeeTenantId);

window.mdmsInitPre = ({ params, data }) => {
  console.log("mdms init pre", params, data);
  return { params, data };
};

window.mdmsInitPost = (data) => {
  console.log("mdms init post", data);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 2000);
  });
};

ReactDOM.render(<DigitUI stateCode="pb" />, document.getElementById("root"));
