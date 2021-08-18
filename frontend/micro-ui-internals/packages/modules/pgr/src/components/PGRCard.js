import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const PGRCard = () => {
  const allLinks = [
    { text: "Inbox", link: "/digit-ui/employee/pgr/inbox" },
    { text: "New Complaint", link: "/digit-ui/employee/pgr/complaint/create", accessTo: ["CSR"] },
  ];

  if (!Digit.Utils.pgrAccess()) {
    return null;
  }

  return (
    <div className="employeeCard card-home">
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
          {allLinks.map((link, index) => {
            if (!link.accessTo || Digit.UserService.hasAccess(link.accessTo)) {
              return (
                <span className="link" key={index}>
                  <Link to={link.link}>{link.text}</Link>
                </span>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};
export default PGRCard;
