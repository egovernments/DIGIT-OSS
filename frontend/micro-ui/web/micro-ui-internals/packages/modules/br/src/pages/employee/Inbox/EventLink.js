import React from "react";
import { Card, DocumentIcon, EventCalendar } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const EventLink = ({ title = "Birth", links, icon = 'calender' }) => {
  const { t } = useTranslation();

  const GetLogo = () => (
    <div className="header" style={{ justifyContent: "flex-start" }}>
      <span className="logo" style={{ backgroundColor: "#fff" }}>
        {icon === "calender" ? <EventCalendar /> : icon === "survey" ? 'surveyIcon' :  <DocumentIcon />}
      </span>
      {" "}
      <span className="text">{t(title)}</span>
    </div>
  );
  
return (
  <Card className="employeeCard filter inboxLinks">
    <div className="complaint-links-container">
      {GetLogo()}
      <div className="body">
        {links.map(({ link, text, hyperlink = false, accessTo = [] }, index) => {
          return (
            <span className="link" key={index}>
        <Link to={"citizen/br/birth"}>{"create"}</Link>
            </span>
          );
        })}
      </div>
    </div>
  </Card>
)
};

export default EventLink;