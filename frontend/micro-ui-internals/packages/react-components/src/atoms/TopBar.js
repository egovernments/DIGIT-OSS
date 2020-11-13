import React from "react";

const TopBar = (props) => {
  return (
    <div className="navbar">
      <img src={props.img} alt="mSeva Logo" />
    </div>
  );
};

export default TopBar;
