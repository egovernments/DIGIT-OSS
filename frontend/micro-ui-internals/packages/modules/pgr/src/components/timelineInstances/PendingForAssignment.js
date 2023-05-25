import React from "react";
import { CheckPoint } from "@egovernments/digit-ui-react-components";

const PendingForAssignment = ({ isCompleted, text, complaintFiledDate }) => {
  return <CheckPoint isCompleted={isCompleted} label={text} />;
};

export default PendingForAssignment;
