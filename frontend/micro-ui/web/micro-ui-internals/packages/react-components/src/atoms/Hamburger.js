import React from "react";
import { HamburgerIcon } from "./svgindex";

const Hamburger = ({ handleClick, color }) => (
  <span style={{ marginRight: "10px" }} className="hamburger-span" onClick={handleClick}>
    <HamburgerIcon className="hamburger" color={color} />
  </span>
);

export default Hamburger;
