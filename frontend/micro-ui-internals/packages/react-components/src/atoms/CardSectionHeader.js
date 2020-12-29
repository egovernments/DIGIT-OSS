import React from "react";

const CardSectionHeader = (props) => {
  return (
    <header className="card-section-header" style={props.style}>
      {props.children}
    </header>
  );
};

export default CardSectionHeader;
