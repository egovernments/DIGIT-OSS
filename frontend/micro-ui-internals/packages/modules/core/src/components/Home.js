import React from "react";
import { Link } from "react-router-dom";
import { PGRLinks } from "@egovernments/digit-ui-module-pgr/src/Module";
import { FSMLinks } from "@egovernments/digit-ui-module-fsm/src/Module";

const CitizenHome = ({ userType }) => (
  <React.Fragment>
    <PGRLinks matchPath={`/digit-ui/${userType}/pgr`} userType={userType} />
    <FSMLinks matchPath={`/digit-ui/${userType}/fsm`} userType={userType} />
  </React.Fragment>
);

const EmployeeHome = () => (
  <div className="employee-app-container">
    <div className="ground-container">
      <div className="employeeCard">
        <div className="complaint-links-container">
          <div className="header">
            <span className="logo">
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                <path d="M0 0h24v24H0z" fill="none"></path>
                <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z" fill="white"></path>
              </svg>
            </span>
            <span className="text">Complaints</span>
          </div>
          <div className="body">
            <span className="link">
              <Link to="/digit-ui/employee/pgr/inbox">Inbox</Link>
            </span>
            <span className="link">
              <Link to="/digit-ui/employee/pgr/complaint/create">New Complaint</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const AppHome = ({ userType }) => {
  if (userType === "citizen") {
    return <CitizenHome userType="citizen" />;
  }
  return <EmployeeHome />;
};
