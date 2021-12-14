import React from "react";

const PopUp = ({className, ...props}) => {
  return <div className={`popup-wrap ${className}`}>{props.children}</div>;
};

export default PopUp;
