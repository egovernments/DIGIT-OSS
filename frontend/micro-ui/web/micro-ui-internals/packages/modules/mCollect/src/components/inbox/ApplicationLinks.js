import { Card, ShippingTruck } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const InboxLinks = ({ parentRoute, businessService, allLinks, headerText }) => {
  const { t } = useTranslation();
  const [links, setLinks] = useState([]);
  const { roles: userRoles } = Digit.UserService.getUser().info;
  useEffect(() => {
    
    let linksToShow = allLinks ? allLinks
      .filter((e) => e.businessService === businessService)
      .filter(({ roles }) => roles.some((e) => userRoles.map(({ code }) => code).includes(e)) || !roles.length):[];
    setLinks(linksToShow);
  }, []);

  const GetLogo = () => (
    <div className="header" style={{ justifyContent: "flex-start" }}>
      <span className="logo">
        <ShippingTruck />
      </span>{" "}
      <span className="text">{t(headerText)}</span>
    </div>
  );

  return (
    <Card style={{ paddingRight: 0, marginTop: 0 }} className="employeeCard filter">
      <div className="complaint-links-container">
        {GetLogo()}
        <div className="body">
          {links.map(({ link, text, hyperlink = false, accessTo = [] }, index) => {
            return (
              <span className="link" key={index}>
                {hyperlink ? <a href={link}>{t(text)}</a> : <Link to={link}>{t(text)}</Link>}
              </span>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default InboxLinks;