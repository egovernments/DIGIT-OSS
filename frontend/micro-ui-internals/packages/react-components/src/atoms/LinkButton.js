import React from "react";

const LinkButton = (props) => {
  return (
    <span className="card-link" onClick={props.onClick}>
      {props.label}
    </span>
  );
};

export default LinkButton;
