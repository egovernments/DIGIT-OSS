import React from "react";

const CardLabelDesc = ({ children, style, className }) => {
  return (
    <h2 className={`card-label-desc ${className ? className : ""}`} style={style}>
      {children}
    </h2>
  );
};

export default CardLabelDesc;
