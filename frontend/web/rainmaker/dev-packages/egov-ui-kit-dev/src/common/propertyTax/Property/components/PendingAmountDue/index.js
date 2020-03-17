import React, { Component } from "react";
import { Dialog, Button } from "components";
import { withRouter } from "react-router-dom";
import Label from "egov-ui-kit/utils/translationNode";
import {getLocaleLabels} from "egov-ui-framework/ui-utils/commons.js";
import "./index.css";

const bodyStyle = {
    backgroundColor: "#FFFFFF",
    border: "0.5px solid rgba(0, 0, 0, 0)",
    boxShadow: "0 24px 24px 0 rgba(0, 0, 0, 0.3), 0 0 24px 0 rgba(0, 0, 0, 0.22)",
    height: "240px !important"
}

const contentStyle = {
    width: "100%",
    maxWidth: "fit-content"
}

class PendingAmountDialog extends Component {

  navigateToCommonPay = (envURL) => {
    this.props.closeDialogue();
    this.props.history.push(`${envURL}?consumerCode=${this.props.consumerCode}&tenantId=${this.props.tenantId}`);
  }

  dialogContent = (amount)=>{
    return getLocaleLabels("PT_YOU_HAVE", "PT_YOU_HAVE")+" "+ getLocaleLabels("PT_MUTATION_RS", "PT_MUTATION_RS")+"<b>"+amount+"</b>"+" "+ getLocaleLabels("PT_PENDING_AMOUNT","PT_PENDING_AMOUNT")+"<br/>"+getLocaleLabels("PT_INORDER_TO_TRANSFER","PT_INORDER_TO_TRANSFER");
  }

  render() {
    const { open, closeDialogue, amount } = this.props;
    const envURL = "/egov-common/pay";
    return (
      <Dialog
        open={open}
        children={[
          <div style={{ margin: 16, display: "grid" }}>
            <Label label="PT_PENDING_AMOUNT_DUE" fontSize="20px" labelClassName="pending-amount-due" />
            <br />
            <p className="dialog-content">
              <Label fontSize="18px" className="dialog-content-label" label="PT_YOU_HAVE"/>&nbsp;<Label className="dialog-content-label" labelClassName="dialog-content-label" fontSize="18px" label="PT_MUTATION_RS"/>&nbsp;<div className="dialog-content-amount">{amount}</div>&nbsp;<Label className="dialog-content-label" label="PT_PENDING_AMOUNT" fontSize="18px" />
              <Label fontSize="18px" label="PT_INORDER_TO_TRANSFER"/>
            </p>

            <div className="text-right" style={{ marginTop: 10 }}>
              <Label className="footer-amount" labelClassName="footer-amount" label="PT_MUTATION_RS" fontSize="24px" /><span className="footer-amount-no" > {amount}</span>&nbsp;&nbsp;&nbsp;&nbsp;
              <Button
                label={<Label buttonLabel={true} label="PT_PROCEED_TO_PAY" fontSize="16px" labelClassName="footer-button-label" />}
                primary={true}
                className="footer-button"
                onClick={()=>{this.navigateToCommonPay(envURL)}}
              />
            </div>
          </div>
        ]}
        bodyStyle={bodyStyle}
        isClose={true}
        handleClose={closeDialogue}
        onRequestClose={closeDialogue}
        contentStyle={contentStyle}
        contentClassName="amount-due-dialog-content"
      />
    );
  }

};

export default withRouter(PendingAmountDialog);
