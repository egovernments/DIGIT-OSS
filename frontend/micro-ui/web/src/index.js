import React from 'react';
import ReactDOM from 'react-dom';
import initLibraries from "@egovernments/digit-ui-libraries";

import "./index.css";
import App from './App';

initLibraries();

// const token = window.localStorage.getItem("token");
const citizenToken = window.localStorage.getItem("Citizen.token");
// const employeeToken = window.localStorage.getItem("Employee.token");

// const isLoggedIn = token || citizenToken || employeeToken;
// const isCitizenLogin = token === citizenToken;


window.Digit.SessionStorage.set("citizen.token", citizenToken);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

