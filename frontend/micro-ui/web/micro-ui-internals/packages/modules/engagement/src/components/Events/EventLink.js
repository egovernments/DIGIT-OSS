import React from "react";
import { Card, EventCalendar } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const EventLink = () => {
  const { t } = useTranslation();
  const links = [
    {
      text: t("ES_TITLE_NEW_EVENTS"),
      link: "/digit-ui/employee/event/new-event",
    }
  ]

  const GetLogo = () => (
    <div className="header">
      <EventCalendar />
      {" "}
      <span className="text">{t("EVENTS_EVENTS_HEADER")}</span>
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
                {hyperlink ? <a href={link}>{text}</a> : <Link to={link}>{text}</Link>}
              </span>
            );
          })}
        </div>
      </div>
    </Card>
  )
};

export default EventLink;