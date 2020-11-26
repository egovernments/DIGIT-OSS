import React from "react";

const TopBar = ({ img, state = "Demo" }) => {
  return (
    <div className="navbar">
      <img src={img || "https://cdn.jsdelivr.net/npm/@egovernments/digit-ui-css@1.0.7/img/m_seva_white_logo.png"} alt="mSeva" />
      <span>{state}</span>
    </div>
  );
};

export default TopBar;
