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
  float: 'right',
  backgroundColor: "rgb(242, 242, 242)",
  boxShadow: "none",
  border: "1px solid rgb(254, 122, 81)",
  borderRadius: "2px",
  outline: "none",
  alignItems: "right",
};

export const TotalDuesButton = ({ labelText, onClickAction, primary }) => {
  return (
    <Button
      onClick={() => {
        onClickAction();
      }}
      label={<Label buttonLabel={true} label={labelText} color={primary ? 'rgb(255, 255, 255)' : 'rgb(254, 122, 81)'} fontSize="16px" labelStyle={labelStyle} />}
      primary={primary ? primary : false}
      buttonStyle={primary ? {} : buttonStyle}
      style={{ lineHeight: "auto", minWidth: "inherit" }}
    />
  );
};
