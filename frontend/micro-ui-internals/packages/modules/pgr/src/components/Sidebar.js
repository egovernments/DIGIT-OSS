import React, { useRef, useState } from "react";
import { NavBar, Hamburger } from "@egovernments/digit-ui-react-components";
import SideBarMenu from "../../src/config/sidebar-menu";

const Sidebar = ({ isOpen, isMobile, toggleSidebar, onLogout }) => {
  const user = Digit.UserService.getUser();
  let menuItems = SideBarMenu;
  if (user && user.access_token) {
    menuItems = [
      ...SideBarMenu,
      {
        text: "Logout",
        populators: {
          onClick: onLogout,
        },
      },
    ];
  }

  return (
    <div>
      <NavBar open={isOpen} menuItems={menuItems} onClose={() => toggleSidebar(false)} />
    </div>
  );
};

export default Sidebar;
