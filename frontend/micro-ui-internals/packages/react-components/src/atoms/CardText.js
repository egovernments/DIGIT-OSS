import React from "react";

const CardText = (props) => {
  return (
    <p className="card-text" style={props.style}>
      {props.children}
    </p>
  );
};

export default CardText;
