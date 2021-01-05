import React from "react";
import { HamburgerIco } from "./svgindex";

const Hamburger = ({ handleClick }) => (
  <div onClick={handleClick}>
    <HamburgerIco />
  </div>
);

export default Hamburger;
