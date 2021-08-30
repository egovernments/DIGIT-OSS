import React from "react";
import "./index.css";
import { TextArea } from "components";

const TextAreaComponent = ({ hintText, onChange, value }) => {
  return (
    <TextArea
      id="feedback-comments"
      hintText={hintText}
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
