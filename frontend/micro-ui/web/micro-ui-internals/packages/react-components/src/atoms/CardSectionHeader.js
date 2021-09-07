import React from "react";

const CardSectionHeader = (props) => {
  return (
    <header id={props.id} className="card-section-header" style={props.style}>
      {props.children}
    </header>
  );
};

export default CardSectionHeader;
