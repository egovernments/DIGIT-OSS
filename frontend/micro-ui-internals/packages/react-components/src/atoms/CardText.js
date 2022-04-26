import React from "react";

const CardText = (props) => {
  return (
    <p className={`card-text ${props.disable && "disabled"} ${props?.className ? props?.className : ""}`} style={props.style}>
      {props.children}
    </p>
  );
};

export default CardText;
