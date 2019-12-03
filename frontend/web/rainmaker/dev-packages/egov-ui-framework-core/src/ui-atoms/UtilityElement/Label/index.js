import React from "react";

const Label = ({ label, jsonPath, ...rest }) => (
  <span {...rest}>{label ? label : label === 0 ? 0 : "NA"}</span>
);

export default Label;
