import { Card } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";

const ComplaintsLink = ({ isMobile }) => {
  const allLinks = [
    { text: "New Complaint", link: "/" },
    { text: "Reports", link: "/" },
    { text: "Dashboard", link: "/" },
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
      <span className="logo">Logo</span> <span className="text">Complaints</span>
    </div>
  );

  return (
    <Card>
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
