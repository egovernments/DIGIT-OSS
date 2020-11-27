import React from "react";

const Card = (props) => {
  return (
    <div className="card" onClick={props.onClick}>
      {props.children}
    </div>
  );
};

export default Card;
