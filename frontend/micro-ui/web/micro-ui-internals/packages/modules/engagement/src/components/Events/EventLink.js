import React from "react";
import { Card, EventCalendar } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const EventLink = ({title, links, icon='calender'}) => {
  const { t } = useTranslation();
 
  const GetLogo = () =>{ 
  if(icon ==="calender"){
    return(
      <div className="header" style={{ justifyContent: "flex-start" }}>
        <span className="logo" style={{ backgroundColor: "#fff" }}>
          <EventCalendar />
        </span>
        {" "}
        <span className="text">{t("EVENTS_EVENTS_HEADER")}</span>
      </div>
    );
  }

  if(icon ==='survey'){
    <div className="header" style={{ justifyContent: "flex-start" }}>
    <span className="logo" style={{ backgroundColor: "#fff" }}>
      {/* <EventCalendar /> */}
    </span>
    {" "}
    <span className="text">{t("SURVEYS_SURVEYS_HEADER")}</span>
  </div>
  }
  
  }
  return (
    <Card className="employeeCard filter inboxLinks">
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