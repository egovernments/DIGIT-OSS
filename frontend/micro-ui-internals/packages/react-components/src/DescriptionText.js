import React from "react";

const DescriptionText = (props) => {
  return (
    <div className="description-wrap">
      <p>{props.text}</p>
    </div>
  );
};

export default DescriptionText;
