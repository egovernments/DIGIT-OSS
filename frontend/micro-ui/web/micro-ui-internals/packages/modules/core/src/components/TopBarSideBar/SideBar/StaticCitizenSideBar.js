import React from "react";
import { HomeIcon, LanguageIcon, LogoutIcon } from "@egovernments/digit-ui-react-components";

const config = [
  {
    element: "Home",
    icon: <HomeIcon className="icon" />,
  },
  {
    element: "Language",
    icon: <LanguageIcon className="icon" />,
  },
  {
    element: "Login",
    icon: <LogoutIcon className="icon" />,
  },
];

const StaticCitizenSideBar = () => {
  const renderMenu = (config) => {
    return config.map((item, index) => {
      return (
        <div className="menu-item" key={index}>
          <div className="menu-item-icon">{item.icon}</div>
          <div className="menu-item-text">{item.element}</div>
        </div>
      );
    });
  };
  return (
    <React.Fragment>
      <div className="sidebar-menu"> {renderMenu(config)}</div>
    </React.Fragment>
  );
};
export default StaticCitizenSideBar;
