import React from "react";

const CardLabelError = (props) => {
  return (
    <h2 className={`card-label-error ${props?.className ? props?.className : ""}`} style={props.style}>
      {props.children}
    </h2>
  );
};

export default CardLabelError;
