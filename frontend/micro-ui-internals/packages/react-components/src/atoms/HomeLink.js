import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const HomeLink = ({ to, children }) => (
  <div className="home-link">
    <Link to={to}>{children}</Link>
  </div>
);

HomeLink.propTypes = {
  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  children: PropTypes.string,
};

HomeLink.defaultProps = {
  to: "#",
  children: "Link",
};

export default HomeLink;
