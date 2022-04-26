import React, { useState } from "react";
import PropTypes from "prop-types";
import Hamburger from "./Hamburger";

const TopBar = ({ img, isMobile, logoUrl, onLogout, toggleSidebar, ulb, userDetails }) => {

  return (
    <div className="navbar">
      <div className="center-container">
        {isMobile && <Hamburger handleClick={toggleSidebar} />}
        <img
          className="city"
          id="topbar-logo"
          crossOrigin="anonymous"
          src={img || "https://cdn.jsdelivr.net/npm/@egovernments/digit-ui-css@1.0.7/img/m_seva_white_logo.png"}
          alt="mSeva"
        />
      </div>
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
