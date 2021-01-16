import React from "react";
import { HamburgerIcon } from "./svgindex";

const Hamburger = ({ handleClick }) => (
  <span style={{ marginRight: "10px" }} onClick={handleClick}>
    <HamburgerIcon styles={{ display: "inline" }} />
  </span>
);

export default Hamburger;
