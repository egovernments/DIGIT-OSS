import React from "react";
import { HomeIcon, LanguageIcon, LogoutIcon, AddressBookIcon, LocationIcon } from "@egovernments/digit-ui-react-components";
import ChangeLanguage from "../components/ChangeLanguage";

const SideBarMenu = (t, closeSidebar, redirectToLoginPage, isEmployee) => [
  {
    type: "link",
    element: "HOME",
    text: t("COMMON_BOTTOM_NAVIGATION_HOME"),
    link: isEmployee ? `/${window?.contextPath}/employee` : `/${window?.contextPath}/citizen`,
    icon: "HomeIcon",
    populators: {
      onClick: closeSidebar,
    },
  },
  {
    type: "component",
    element: "LANGUAGE",
    action: <ChangeLanguage />,
    icon: "LanguageIcon",
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
