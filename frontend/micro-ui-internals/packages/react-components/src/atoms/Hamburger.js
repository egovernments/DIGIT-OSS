import React from "react";
import { HamburgerIco } from "./svgindex";

const Hamburger = ({ handleClick }) => (
  <span style={{ marginRight: "10px" }} onClick={handleClick}>
    <HamburgerIco styles={{ display: "inline" }} />
  </span>
);

export default Hamburger;
