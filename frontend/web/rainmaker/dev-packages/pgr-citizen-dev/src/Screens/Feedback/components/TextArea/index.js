import React from "react";
import "./index.css";
import { TextArea } from "components";
import Label from "egov-ui-kit/utils/translationNode";

const TextAreaComponent = ({ hintText, onChange, value }) => {
  return (
    <TextArea
      id="feedback-comments"
      hintText={<Label label={hintText} />}
      style={{ marginTop: "10px" }}
      underlineShow={true}
      hintStyle={{ letterSpacing: "0.7px" }}
      rowsMax={3}
      onChange={onChange}
      value={value}
    />
  );
};

export default TextAreaComponent;
