import React from "react";
import { Link } from "react-router-dom";

const HomeLink = ({ to, children }) => (
  <div className="home-link">
    <Link to={to}>{children}</Link>
  </div>
);

export default HomeLink;
