import { Dropdown } from "@egovernments/digit-ui-react-components";
import React from "react";

const DropdownUlb = ({ ulb, onAssignmentChange, value, t }) => {
  return (
    <Dropdown option={ulb} optionKey="code" selected={value} select={onAssignmentChange} t={t} />
  )
}

export default DropdownUlb; 