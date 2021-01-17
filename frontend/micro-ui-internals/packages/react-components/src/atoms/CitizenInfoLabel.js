import React from "react";

const CitizenInfoLabel = (props) => {
  return (
    <div className="citizen-info-label">
      <h3>{props.info || "Info"}</h3>
      <p>{props.text}</p>
    </div>
  );
};

export default CitizenInfoLabel;
