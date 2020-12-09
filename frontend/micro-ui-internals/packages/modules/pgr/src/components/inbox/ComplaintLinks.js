import { Card } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";

const ComplaintsLink = ({ isMobile, data }) => {
  const allLinks = [
    { text: "New Complaint", link: "/digit-ui/employee/pgr/complaint/create" },
    { text: "Reports", link: "/employee" },
  ];

  const [links, setLinks] = useState(allLinks);

  useEffect(() => {
    if (isMobile) {
      const mobileLinks = links.filter((link) => {
        return link.text !== "Dashboard";
      });
      setLinks(mobileLinks);
    }
  }, []);

  const GetLogo = () => (
    <div className="header">
      <span className="logo">
        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none" /><path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z" fill="white" /></svg>
      </span> <span className="text">Complaints</span>
    </div>
  );

  return (
    <Card style={{ paddingRight: 0 }}>
      <div className="complaint-links-container">
        {GetLogo()}
        <div className="body">
          {links.map(({ link, text }, index) => (
            <span className="link" key={index}>
              <a href={link}>{text}</a>
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ComplaintsLink;
