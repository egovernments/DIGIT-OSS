import React from "react";
import { Checkbox } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import "./index.css";

const CheckboxGroup = ({ selected, onCheck, labelColor }) => {
  const checkboxOptions = [
    { value: "Services", label: "CS_FEEDBACK_SERVICES" },
    { value: "Resolution Time", label: "CS_FEEDBACK_RESOLUTION_TIME" },
    { value: "Quality of work", label: "CS_FEEDBACK_QUALITY_OF_WORK" },
    { value: "Others", label: "CS_FEEDBACK_OTHERS" },
  ];
  return (
    <div>
      <Label className="what-was-good" label="CS_FEEDBACK_WHAT_WAS_GOOD" />
      <Checkbox
        labelStyle={{ letterSpacing: "0.6px" }}
        options={checkboxOptions}
        containerClassName={"feedback-checkbox-cont"}
        selected={selected}
        iconStyle={{ fill: "rgb(95, 92, 98)" }}
        onCheck={onCheck}
        id="feedback-checkbox"
      />
    </div>
  );
};

export default CheckboxGroup;
