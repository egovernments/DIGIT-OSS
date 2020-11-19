import { Card } from "@egovernments/digit-ui-react-components";
import React from "react";

const ComplaintsLink = () => {
  const links = [
    { text: "New Complaint", link: "/" },
    { text: "Reports", link: "/" },
    { text: "Dashboard", link: "/" },
  ];

  const GetLogo = () => (
    <div className="header">
      <span className="logo">Logo</span> <span className="text">Complaints</span>
    </div>
  );

  return (
    <div className="complaint-links-container">
      {GetLogo()}
      <div className="body">
        {links.map(({ link, text }) => (
          <span className="link">
            <a href={link}>{text}</a>
          </span>
        ))}
      </div>
    </div>
  );
};

export default ComplaintsLink;
