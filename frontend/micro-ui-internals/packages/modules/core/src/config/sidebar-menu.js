import React from "react";
import { HomeIcon, LanguageIcon } from "@egovernments/digit-ui-react-components";
import ChangeLanguage from "../components/ChangeLanguage";

const SideBarMenu = (t) => [
  {
    text: t("COMMON_BOTTOM_NAVIGATION_HOME"),
    link: "/citizen/",
    icon: <HomeIcon className="icon" />,
  },
  {
    type: "component",
    action: <ChangeLanguage />,
    icon: <LanguageIcon className="icon" />,
  },
];

export default SideBarMenu;
