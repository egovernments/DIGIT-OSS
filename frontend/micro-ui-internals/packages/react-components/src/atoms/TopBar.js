import React, { useState } from "react";
import PropTypes from "prop-types";
import Hamburger from "./Hamburger";
import Menu from "./Menu";
import { ArrowDown } from "./svgindex";

const TextToImg = ({ name }) => <span className="user-img-txt">{name[0].toUpperCase()}</span>;

const TopBar = ({ img, isMobile, logoUrl, onLogout, toggleSidebar, ulb, userDetails }) => {
  const [isMenuOpen, toggleMenu] = useState(false);
  const openMenu = () => {
    toggleMenu(!isMenuOpen);
  };

  const options = ["Logout"];

  const onSelect = () => {
    onLogout();
  };
  return (
    <div className="navbar">
      {isMobile && <Hamburger handleClick={toggleSidebar} />}
      <img className="city" src={img || "https://cdn.jsdelivr.net/npm/@egovernments/digit-ui-css@1.0.7/img/m_seva_white_logo.png"} alt="mSeva" />
      {/* <span className="ulb">{ulb}</span> */}
      {/* !isMobile && (
        <div className="right">
          <TextToImg name={userDetails?.info?.name || userDetails?.info?.userInfo?.name || "Employee"} />
          <ArrowDown styles={{ display: "inline" }} onClick={openMenu} />
          <img className="state" src={logoUrl} />
          {isMenuOpen && <Menu options={options} onSelect={onSelect} />}
        </div>
      )} */}
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
