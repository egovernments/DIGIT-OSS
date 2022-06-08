import React from "react";
import { Checkbox } from "components";
import Label from "utils/translationNode";
import "./index.css";

const checkboxOptions = [
  { value: "Services", label: <Label label="CS_FEEDBACK_SERVICES" /> },
  { value: "Resolution Time", label: <Label label="CS_FEEDBACK_RESOLUTION_TIME" /> },
  { value: "Quality of work", label: <Label label="CS_FEEDBACK_QUALITY_OF_WORK" /> },
  { value: "Others", label: <Label label="CS_FEEDBACK_OTHERS" /> },
];

const CheckboxGroup = ({ selected, onCheck }) => {
  return (
    <div>
      <Label className="what-was-good" label="CS_FEEDBACK_WHAT_WAS_GOOD" />
      <Checkbox
        labelStyle={{ letterSpacing: "0.6px" }}
        options={checkboxOptions}
        containerClassName={"feedback-checkbox-cont"}
        selected={selected}
        onCheck={onCheck}
        id="feedback-checkbox"
      />
    </div>
  );
};

export default CheckboxGroup;
