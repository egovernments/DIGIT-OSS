import React from "react";

const CardSectionSubText = (props) => {
  return (
    <header id={props.id} className="card-section-sub-text" style={props.style}>
      {props.children}
    </header>
  );
};

export default CardSectionSubText;
