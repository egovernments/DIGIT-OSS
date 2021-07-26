import React from "react";

const LabelFieldPair = (props) => {
  return (
    <div style={{ ...props.style }} className="label-field-pair">
      {props.children}
    </div>
  );
};

export default LabelFieldPair;
