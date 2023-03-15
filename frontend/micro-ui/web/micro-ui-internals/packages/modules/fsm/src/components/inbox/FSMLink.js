import { Card, ShippingTruck } from "@egovernments/digit-ui-react-components";
import { forEach } from "lodash";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const FSMLink = ({ parentRoute, isMobile, data }) => {
  const { t } = useTranslation();

  const allLinks = [
    {
      text: t("ES_TITLE_NEW_DESULDGING_APPLICATION"),
      link: "/digit-ui/employee/fsm/new-application",
      roles: ["FSM_CREATOR_EMP"],
    },
    // { text: t("ES_TITLE_REPORTS"), link: "/employee" },
    {
      text: t("ES_TITILE_SEARCH_APPLICATION"),
      link: `${parentRoute}/search`,
    },
    {
      text: t("ES_TITLE_REPORTS"),
      link: `/employee/report/fsm/FSMDailyDesludingReport`,
      roles: ["FSM_ADMIN"],
      hyperlink: true,
    },
  ];

  const [links, setLinks] = useState([]);

  const { roles: userRoles } = Digit.UserService.getUser().info;

  useEffect(() => {
    let linksToShow = allLinks.filter(({ roles }) => roles?.some((e) => userRoles?.map(({ code }) => code).includes(e)) || !roles?.length);
    setLinks(linksToShow);
  }, []);

  // useEffect(() => {
  //   if (isMobile) {
  //     const mobileLinks = links.filter((link) => {
  //       return link.text !== t("ES_DASHBOARD");
  //     });
  //     setLinks(mobileLinks);
  //   }
  // }, []);
  const GetLogo = () => (
    <div className="header">
      <span className="logo">
        <ShippingTruck />
      </span>{" "}
      <span className="text">{t("ES_TITLE_FAECAL_SLUDGE_MGMT")}</span>
    </div>
  );

  return (
    <Card className="employeeCard inboxLinksFSM">
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
  );
};

export default FSMLink;
