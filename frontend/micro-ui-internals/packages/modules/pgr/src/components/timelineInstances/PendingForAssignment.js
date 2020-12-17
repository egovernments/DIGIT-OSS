import React from "react";

const PendingForAssignment = ({ text, complaintFiledDate }) => {
  return (
    <React.Fragment>
      {text}
      <p>{complaintFiledDate}</p>
    </React.Fragment>
  );
};

export default PendingForAssignment;
