import React from 'react';
import ReactDOM from 'react-dom';
import initLibraries from "@egovernments/digit-ui-libraries";

import "./index.css";
import App from './App';

initLibraries();

// const token = window.localStorage.getItem("token");
const citizenToken = window.localStorage.getItem("Citizen.token");
const citizenInfo = window.localStorage.getItem("Citizen.user-info");
// const employeeToken = window.localStorage.getItem("Employee.token");

// const isLoggedIn = token || citizenToken || employeeToken;
// const isCitizenLogin = token === citizenToken;


window.Digit.SessionStorage.set("citizen.token", citizenToken);
window.Digit.SessionStorage.set("citizen.userServiceData", { userInfo: citizenInfo });
window.Digit.SessionStorage.set("User", { token: citizenToken, mobileNumber: citizenInfo.mobileNumber });

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

