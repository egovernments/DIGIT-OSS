import React, { useRef, useState } from "react";
import { NavBar, Hamburger } from "@egovernments/digit-ui-react-components";
import SideBarMenu from "../../src/config/sidebar-menu";
//import { useOnClickOutside } from "../../../../libraries/src/hooks/useClickOutside";

const Sidebar = () => {
  const [open, setopen] = useState(false);
  const node = useRef();

  Digit.Hooks.useClickOutside(node, () => setopen(false));

  //   const handleSidebar = () => {
  //     setopen(!open);
  //   };

  return (
    <div ref={node}>
      <Hamburger handleClick={() => setopen(!open)} />
      <NavBar open={open} menuItems={SideBarMenu} />
    </div>
  );
};

export default Sidebar;
