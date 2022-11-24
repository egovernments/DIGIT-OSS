import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Hamburger from "./Hamburger";
import { NotificationBell } from "./svgindex";

const TopBar = ({ img, isMobile, logoUrl, onLogout, toggleSidebar, ulb, userDetails, notificationCount, notificationCountLoaded, cityOfCitizenShownBesideLogo, onNotificationIconClick, hideNotificationIconOnSomeUrlsWhenNotLoggedIn }) => {
  const userInfo = Digit.UserService.getUser();

  return (
    <div className="navbar">
      <div className="center-container">
     
      {isMobile && <Hamburger handleClick={toggleSidebar} />}
        <img
          className="city"
          id="topbar-logo" 
          src={"https://filesuploadbucket1aws.s3.amazonaws.com/tcp-haryana/tcp-logo-hr2.png"}
          height="100px"
          alt="TCP"
        />
        <div className="RightMostTopBarOptions">
        <h3 className="mx-2 fw-bold">{userInfo?.info?.name}</h3>
          {!hideNotificationIconOnSomeUrlsWhenNotLoggedIn ? <span className="EventNotificationWrapper" onClick={onNotificationIconClick}>
            { notificationCountLoaded && notificationCount ? <span><p>{notificationCount}</p></span> : null }
            <NotificationBell style={{display:"inline-block"}} />
            
          </span> : null}
        </div>
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