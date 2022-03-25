import { AnnouncementIcon, Card } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const InboxLinks = ({ parentRoute, businessService, allLinks, headerText }) => {
  const { t } = useTranslation();

  const GetLogo = () => (
    <div className="header">
      <span className="logo">
        <AnnouncementIcon />
      </span>{" "}
      <span className="text">{t(headerText)}</span>
    </div>
  );
  return (
    <Card className="employeeCard filter inboxLinks">
      <div className="complaint-links-container">
        {GetLogo()}
        <div className="body">
          {allLinks.map(({ link, text, hyperlink = false, accessTo = [] }, index) => {
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
