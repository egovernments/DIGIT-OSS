import React from "react";
import { HomeIcon, LanguageIcon } from "@egovernments/digit-ui-react-components";
import ChangeLanguage from "../components/ChangeLanguage";

const SideBarMenu = (t, closeSidebar,isEmployee) => [
  {
    type: "link",
    text: t("COMMON_BOTTOM_NAVIGATION_HOME"),
    link: isEmployee?"/digit-ui/employee/":"/digit-ui/citizen/",
    icon: <HomeIcon className="icon" />,
    populators: {
      onClick: closeSidebar,
    },
  },
  {
    type: "component",
    action: <ChangeLanguage />,
    icon: <LanguageIcon className="icon" />,
  },
];

export default SideBarMenu;
