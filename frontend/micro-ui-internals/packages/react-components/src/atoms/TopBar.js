import React from "react";
import PropTypes from "prop-types";

const TopBar = ({ img }) => {
  return (
    <div className="navbar">
      <img src={img || "https://cdn.jsdelivr.net/npm/@egovernments/digit-ui-css@1.0.7/img/m_seva_white_logo.png"} alt="mSeva" />
    </div>
  );
};

TopBar.propTypes = {
  img: PropTypes.string,
};

TopBar.defaultProps = {
  img: undefined,
};

export default TopBar;
