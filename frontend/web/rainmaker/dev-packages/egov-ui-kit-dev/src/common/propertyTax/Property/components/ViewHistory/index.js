import React from "react";
import { Dialog, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import TransferDetails from "./TransferDetails";
import "./index.css";
import { convertEpochToDate } from "egov-ui-framework/ui-config/screens/specs/utils";

const bodyStyle = {
  backgroundColor: "#FFFFFF",
  border: "0.5px solid rgba(0, 0, 0, 0)",
  boxShadow: "0 24px 24px 0 rgba(0, 0, 0, 0.3), 0 0 24px 0 rgba(0, 0, 0, 0.22)",
  height: "625px",
};

const contentStyle = {
  width: "100%",
  maxWidth: "fit-content",
};

const ViewHistoryDialog = ({ open, closeDialogue, ownershipInfo }) => {
  return (
    <Dialog
      open={open}
      children={[
        <div style={{ margin: 16 }}>
          <Label label="PT_OWNER_HISTORY" fontSize="20px" labelClassName="owner-history" />
          <br />
          {Object.keys(ownershipInfo).map((key) => {
            const date=convertEpochToDate(Number(key));
            return (
              <div className="dialog-content">
                <div className="oval-class"></div>
                <Label label="PT_DATE_OF_TRANSFER" fontSize="14px" className="date-of-transfer" labelClassName="date-of-transfer" />
                <span className="date-of-transfer">&nbsp;-&nbsp;{date}</span>
                <TransferDetails data={ownershipInfo[key]} />
              </div>
            );
          })}
        </div>,
      ]}
      bodyStyle={bodyStyle}
      isClose={true}
      handleClose={closeDialogue}
      onRequestClose={closeDialogue}
      contentStyle={contentStyle}
      autoScrollBodyContent={true}
      contentClassName="view-history-dialog"
    />
  );
};

export default ViewHistoryDialog;
