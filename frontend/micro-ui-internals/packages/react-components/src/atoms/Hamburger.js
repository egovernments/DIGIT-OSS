import React from "react";
import { HamburgerIcon } from "./svgindex";

const Hamburger = ({ handleClick, color }) => (
  <span style={{ marginRight: "10px" }} className="cp" onClick={handleClick}>
    <HamburgerIcon styles={{ display: "inline" }} color={color} />
  </span>
);

export default Hamburger;
