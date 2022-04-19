import React from "react";
import { HomeIcon, LanguageIcon, LogoutIcon, AddressBookIcon, LocationIcon } from "@egovernments/digit-ui-react-components";
import ChangeLanguage from "../components/ChangeLanguage";

const SideBarMenu = (t, closeSidebar, redirectToLoginPage, isEmployee) => [
  {
    type: "link",
    element: "HOME",
    text: t("COMMON_BOTTOM_NAVIGATION_HOME"),
    link: isEmployee ? "/digit-ui/employee" : "/digit-ui/citizen",
    icon: <HomeIcon className="icon" />,
    populators: {
      onClick: closeSidebar,
    },
  },
  {
    type: "submenu",
    moduleName: t("DASHBOARD_CITIZEN_SERVICES_LABEL"),
    Icon: <AddressBookIcon className="icon" />,
    links: [
      {
        label: t("ES_PGR_HEADER_COMPLAINT"),
        link: "/digit-ui/citizen/pgr-home",
      },
      {
        label: t("MODULE_PT"),
        link: "/digit-ui/citizen/pt-home",
      },
      {
        label: t("MODULE_TL"),
        link: "/digit-ui/citizen/tl-home",
      },
      {
        label: t("CS_COMMON_INBOX_BPA"),
        link: "/digit-ui/citizen/obps-home",
      },
    ],
  },
  {
    type: "submenu",
    moduleName: t("CS_COMMON_DASHBOARD_INFO_UPDATES"),
    Icon: <LocationIcon className="icon" />,
    links: [
      {
        label: t("EVENTS_EVENTS_HEADER"),
        link: "/digit-ui/citizen/engagement/events",
      },
      {
        label: t("CS_COMMON_DOCUMENTS"),
        link: "/digit-ui/citizen/engagement/docs",
      },
      {
        label: t("CS_COMMON_SURVEYS"),
        link: "/digit-ui/citizen/engagement/surveys/list",
      },
    ],
  },
  {
    type: "component",
    element: "LANGUAGE",
    action: <ChangeLanguage />,
    icon: <LanguageIcon className="icon" />,
  },
  {
    id: "login-btn",
    element: "LOGIN",
    text: t("CORE_COMMON_LOGIN"),
    icon: <LogoutIcon className="icon" />,
    populators: {
      onClick: redirectToLoginPage,
    },
  },
];

export default SideBarMenu;
