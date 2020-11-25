import React from "react";

const TopBar = (props) => {
  return (
    <div className="navbar">
      <img src={props.img || "https://unpkg.com/browse/@egovernments/digit-ui-css/img/browser-icon.png"} alt="mSeva Logo" />
    </div>
  );
};

export default TopBar;
