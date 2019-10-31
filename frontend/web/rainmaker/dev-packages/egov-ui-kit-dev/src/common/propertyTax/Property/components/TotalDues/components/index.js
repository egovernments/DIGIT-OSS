import React from "react";
import { Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import './index.css';

const labelStyle = {
  letterSpacing: 1.2,
  fontWeight: "600",
  lineHeight: "40px",
};
const buttonStyle = {
  lineHeight: "35px",
  height: "35px",
  backgroundColor: "rgb(242, 242, 242)",
  boxShadow: "none",
  border: "1px solid rgb(254, 122, 81)",
  borderRadius: "2px",
  outline: "none",
  alignItems: "right",
};

export const TotalDuesButton = ({ labelText }) => {
  return (
    <Button
      label={<Label buttonLabel={true} label={labelText} color="rgb(254, 122, 81)" fontSize="16px" height="40px" labelStyle={labelStyle} />}
      buttonStyle={buttonStyle}
      onClick={() => {
        console.log(labelText + " BUTTON CLICKED");
      }}
    ></Button>
  );
};
