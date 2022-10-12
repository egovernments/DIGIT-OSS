import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Hamburger from "./Hamburger";
import { NotificationBell } from "./svgindex";

const TopBar = ({ img, isMobile, logoUrl, onLogout, toggleSidebar, ulb, userDetails, notificationCount, notificationCountLoaded, cityOfCitizenShownBesideLogo, onNotificationIconClick, hideNotificationIconOnSomeUrlsWhenNotLoggedIn }) => {
  const [profileName,setProfileName]=useState("Noname")
  const userData = JSON.parse(localStorage.getItem('user-info'));
  console.log(userData);
  useEffect(()=>{
    if (userData!==null && userData!==undefined && userData.name!==undefined) {
      setProfileName(userData.name)
    }
  }, [userData])

  return (
    <div className="navbar">
      <div className="center-container">
     
      {isMobile && <Hamburger handleClick={toggleSidebar} />}
        <img
          className="city"
          id="topbar-logo" 
          src={"http://10.1.1.10:7001/tcp/assets/img/logo-white.png"}
          alt="TCP"
        />
        <div className="RightMostTopBarOptions">
       
          {!hideNotificationIconOnSomeUrlsWhenNotLoggedIn ? <div className="EventNotificationWrapper" onClick={onNotificationIconClick}>
            { notificationCountLoaded && notificationCount ? <span><p>{notificationCount}</p></span> : null }
            <NotificationBell />
            <h3>{profileName}</h3>
          </div> : null}
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
