import React from "react";

const TopBar = (props) => {
  return (
    <div className="navbar">
      <img src={props.img || "https://cdn.jsdelivr.net/npm/@egovernments/digit-ui-css@1.0.7/img/m_seva_white_logo.png"} alt="mSeva Logo" />
    </div>
  );
};

export default TopBar;
