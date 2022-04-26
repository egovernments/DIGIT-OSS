import React from "react";

const ActionBar = (props) => {
  return (
    <div className={`action-bar-wrap ${props.className}`} style={props.style}>
      {props.children}
    </div>
  );
};

export default ActionBar;
