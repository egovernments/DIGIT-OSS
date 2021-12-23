import { Card, ShippingTruck } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const ApplicationLinks = ({ linkPrefix }) => {
  const { t } = useTranslation();

  const allLinks = [
    {
      text: t("ES_TITLE_NEW_DESULDGING_APPLICATION"),
      link: "/digit-ui/employee/fsm/new-application",
      accessTo: ["FSM_CREATOR_EMP"],
    },
    // { text: t("ES_TITLE_REPORTS"), link: "/employee" },
    // { text: t("ES_TITLE_DASHBOARD"), link: "/employee" },
    {
      text: t("ES_TITILE_SEARCH_APPLICATION"),
      link: `${linkPrefix}/search`,
    },
  ];

  const [links, setLinks] = useState([]);

  const { roles } = Digit.UserService.getUser().info;

  const hasAccess = (accessTo) => {
    return roles.filter((role) => accessTo.includes(role.code)).length;
  };

  useEffect(() => {
    let linksToShow = [];
    allLinks.forEach((link) => {
      if (link.accessTo) {
        if (hasAccess(link.accessTo)) {
          linksToShow.push(link);
        }
      } else {
        linksToShow.push(link);
      }
    });
    setLinks(linksToShow);
  }, []);

  // useEffect(() => {
  //   if (isMobile) {
  //     const mobileLinks = links.filter((link) => {
  //       return link.text !== t("ES_TITLE_DASHBOARD");
  //     });
  //     setLinks(mobileLinks);
  //   }
  // }, []);

  const GetLogo = () => (
    <div className="header">
      <span className="text">{t("ES_TITLE_FAECAL_SLUDGE_MGMT")}</span>
      <span className="logo">
        <ShippingTruck />
      </span>{" "}
    </div>
  );

  return (
    <Card className="employeeCard filter">
      <div className="complaint-links-container">
        {GetLogo()}
        <div className="body">
          {links.map(({ link, text }, index) => (
            <span className="link" key={index}>
              <Link to={link}>{text}</Link>
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ApplicationLinks;
