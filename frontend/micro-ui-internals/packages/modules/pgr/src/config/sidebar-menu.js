import React from "react";
import ChangeLanguage from "../../../core/src/components/ChangeLanguage";

const languages = ["English", "हिंदी", "ਪੰਜਾਬੀ"];

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
    action: <ChangeLanguage languages={languages} />,
  },
];

export default SideBarMenu;
