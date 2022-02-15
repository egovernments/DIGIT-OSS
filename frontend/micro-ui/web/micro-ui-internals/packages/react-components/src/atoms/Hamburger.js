import React from "react";
import { HamburgerIcon } from "./svgindex";

const Hamburger = ({ handleClick, color }) => (
  <span style={{ marginRight: "10px" }} className="cp" onClick={handleClick}>
    <HamburgerIcon className="hamburger" color={color} />
  </span>
);

export default Hamburger;
