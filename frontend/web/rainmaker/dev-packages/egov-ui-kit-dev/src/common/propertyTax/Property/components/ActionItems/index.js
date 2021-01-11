import React from "react";
import HistoryIcon from "@material-ui/icons/History";
import { Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import "./index.css";

const labelStyle = {
  letterSpacing: 1.2,
  fontWeight: "500",
  lineHeight: "40px",
};
const buttonStyle = {
  lineHeight: "35px",
  height: "100%",
  backgroundColor: "rgb(242, 242, 242)",
  boxShadow: "none",
  border: "none",
  borderRadius: "2px",
  outline: "none",
  alignItems: "right",
};

const viewHistoryLabel = {
  color: "rgba(0, 0, 0, 0.6)",
  fontFamily: "Roboto",
  fontSize: "14px",
  fontWeight: 500,
  letterSpacing: "0.58px",
  lineHeight: "17px",
  textAlign: "left",
  cursor: "pointer",
  paddingRight: "20px",
};

export const ViewHistory = ({ viewHistory, openDialog }) => {
  return (
    viewHistory && (
      <div className="view-history-button"
        onClick={() => {
          openDialog("viewHistory");
        }}
      >
        <HistoryIcon style={{ position: "relative", top: "7px", right: "2px", cursor: "pointer" }} />
        <Label buttonLabel={true} label="PT_VIEW_HISTORY" color="rgb(0, 0, 0, 0.6)" height="40px" labelStyle={viewHistoryLabel} />
      </div>
    )
  );
};

export const TransferOwnership = ({ ownershipTransfer, openDialog }) => {
  return (
    ownershipTransfer && (
      <Button
        className="transfer-ownership"
        label={
          <Label buttonLabel={true} label="PT_OWNERSHIP_TRANSFER" color="rgb(254, 122, 81)" fontSize="16px" height="40px" labelStyle={labelStyle} />
        }
        buttonStyle={buttonStyle}
        onClick={() => {
          openDialog("docRequired");
        }}
      ></Button>
    )
  );
};
