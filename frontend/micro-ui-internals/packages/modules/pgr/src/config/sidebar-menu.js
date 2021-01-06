import React from "react";
import ChangeLanguage from "../../../core/src/components/ChangeLanguage";

const SideBarMenu = [
  {
    text: "Home",
    link: "/citizen/",
  },
  {
    text: "Complaints",
    link: "/complaints/",
  },
  {
    text: "Property tax",
    link: "/pt/",
  },
  {
    text: "Trade licence",
    link: "/trade-licence/",
  },
  {
    type: "component",
    action: <ChangeLanguage />,
  },
];

export default SideBarMenu;
