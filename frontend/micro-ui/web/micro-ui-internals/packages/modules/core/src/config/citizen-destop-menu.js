import React from "react";
import { HomeIcon, LogoutIcon } from "@egovernments/digit-ui-react-components";

const CitizenDesktopMenu = (t, closeSidebar, redirectToLoginPage, isEmployee) => [
  {
    type: "link",
    element: "HOME",
    text: t("COMMON_BOTTOM_NAVIGATION_HOME"),
    link: isEmployee ? "/digit-ui/employee/" : "/digit-ui/citizen/",
    icon: <HomeIcon className="icon" />,
    populators: {
      onClick: closeSidebar,
    },
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

export default CitizenDesktopMenu;
