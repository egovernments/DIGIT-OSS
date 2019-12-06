import React from "react";
import { Dialog, Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import "./index.css";

const bodyStyle = {
    backgroundColor: "#FFFFFF",
    border: "0.5px solid rgba(0, 0, 0, 0)",
    boxShadow: "0 24px 24px 0 rgba(0, 0, 0, 0.3), 0 0 24px 0 rgba(0, 0, 0, 0.22)",
    width: "649px",
    height: "240px !important"
}

const contentStyle = {
    width: "100%",
    maxWidth: "fit-content"
}

const PendingAmountDialog = ({ open, closeDialogue, amount }) => {

  return (
    <Dialog
      open={open}
      children={[
        <div style={{ margin: 16, height: "200px", display: "grid" }}>
          <Label label="PT_PENDING_AMOUNT_DUE" fontSize="20px" labelClassName="pending-amount-due" />
          <br />
          <p className="dialog-content">
            You have <b>Rs {amount}</b> pending amount due. <br />
            Inorder to transfer ownership, you must clear all previous dues.
          </p>
          
          <div className="text-right" style={{ marginTop: 10 }}>
            <span className="footer-amount"><b>Rs {amount}</b></span>
            <Button
              label={<Label buttonLabel={true} label="PT_PROCEED_TO_PAY" fontSize="16px" labelClassName="footer-button-label" />}
              primary={true}
              
              className="footer-button"
              onClick={closeDialogue}
            />
          </div>
        </div>
      ]}
      bodyStyle={bodyStyle}
      isClose={true}
      handleClose={closeDialogue}
      onRequestClose={closeDialogue}
      contentStyle={contentStyle}
    />
  );
};

export default PendingAmountDialog;
