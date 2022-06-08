import React from "react";
import "./index.css";

const VerticalCenterWrapper = ({ leftChildren, rightChildren, leftWrapperStyle, rightWrapperStyle }) => {
  return (
    <div className="wrapper">
      <div style={leftWrapperStyle} className="left">
        {leftChildren}
      </div>
      <div style={rightWrapperStyle} className="right">
        {rightChildren}
      </div>
    </div>
  );
};

export default VerticalCenterWrapper;
