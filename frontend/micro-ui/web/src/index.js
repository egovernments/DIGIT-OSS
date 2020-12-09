import React from 'react';
import ReactDOM from 'react-dom';
import { initLibraries } from "@egovernments/digit-ui-libraries";

import "./index.css";
import App from './App';

initLibraries();

const token = window.localStorage.getItem("token")

const citizenToken = window.localStorage.getItem("Citizen.token")
const citizenInfo = window.localStorage.getItem("Citizen.user-info")
const citizenTenantId = window.localStorage.getItem("Citizen.tenant-id")

const employeeToken = window.localStorage.getItem("Employee.token")
const employeeInfo = window.localStorage.getItem("Employee.user-info")
const employeeTenantId = window.localStorage.getItem("Employee.tenant-id")

const userType = token === citizenToken ? "citizen" : "employee";
window.Digit.SessionStorage.set("user_type", userType);
window.Digit.SessionStorage.set("userType", userType);

const getUserDetails = (token, info) => ({ token, info })

const userDetails = userType === "citizen" ? getUserDetails(citizenToken, citizenInfo) : getUserDetails(employeeToken, employeeInfo)

window.Digit.SessionStorage.set("User", userDetails);

window.Digit.SessionStorage.set("Citizen.tenantId", citizenTenantId);
window.Digit.SessionStorage.set("Employee.tenantId", employeeTenantId);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

