import React from "react"
import Card from "../atoms/Card"
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const InboxLinks = ({logoIcon, headerText, links}) => {
    const { t } = useTranslation();
    
    const GetLogo = () => <div className="header">
        <span className="logo">
        {logoIcon}
        </span>{" "}
        <span className="text">{t(headerText)}</span>
    </div>
    
    return <Card className="employeeCard filter inboxLinks">
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
}

export default InboxLinks