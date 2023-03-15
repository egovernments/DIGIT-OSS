import { Button, Dialog } from "components";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons.js";
import { routeToCommonPay } from "egov-ui-kit/utils/PTCommon/FormWizardUtils/formUtils";
import Label from "egov-ui-kit/utils/translationNode";
import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import "./index.css";
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';



const bodyStyle = {
  backgroundColor: "#FFFFFF",
  border: "0.5px solid rgba(0, 0, 0, 0)",
  boxShadow: "0 24px 24px 0 rgba(0, 0, 0, 0.3), 0 0 24px 0 rgba(0, 0, 0, 0.22)",
}


const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing.unit * 2,
  },
});

const contentStyle = {
  width: "90%",
  maxWidth: "fit-content",
}
const TransferOwnerShipDialog = (props) => {
  // class TransferOwnerShipDialog extends Component { 
  // const classes = useStyles();
  const navigateToRouteUrl = (envURL) => {
    props.closeDialogue();
    // routeToCommonPay(this.props.consumerCode, this.props.tenantId);
    props.history.push(envURL);
  }

  // dialogContent = (amount) => {
  //   return getLocaleLabels("PT_YOU_HAVE", "PT_YOU_HAVE") + " " + getLocaleLabels("PT_MUTATION_RS", "PT_MUTATION_RS") + "<b>" + amount + "</b>" + " " + getLocaleLabels("PT_PENDING_AMOUNT", "PT_PENDING_AMOUNT") + "<br/>" + getLocaleLabels("PT_INORDER_TO_TRANSFER", "PT_INORDER_TO_TRANSFER");
  // }
  const { open, closeDialogue, amount, routeUrl } = props;
  const printDiv = () => {
    let content = document.getElementById("documents-div").innerHTML;
    let printWindow = window.open("", "");
  
    printWindow.document.write(`<html><body>${content}</body></html>`);
  
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };
  return (
    <Dialog
      open={open}
      scroll="paper"
      children={[
        <div style={{ overflow: "hidden" }}>
          <div style={{ margin: "16px",marginBottom:"0" }}>
            <Label label="PT_REQIURED_DOC_TRANSFER_OWNERSHIP" fontSize="20px" labelClassName="pending-amount-due" />
          </div>
          <br />
          <div className="dialog-content transfer-ownership-dialog-content" id="documents-div" style={{ margin: "16px" ,marginTop:"0"}}>

            {props.documents.map(item1 =>
              <div className="pt-custom-dialog-gray-card">
                <div style={{marginBottom:"12px"}}>
                <Label className="document-header" fontSize="16px" color="rgba(0, 0, 0, 0.87"  label={item1.code} />
                </div>
                <div className="pt-custom-dialog-container">
                  <Grid container className={props.classes.root} spacing={16}>
                    <Grid item xs={12}>
                      <Grid container className={props.classes.demo} spacing={32}>
                        {item1.dropdownData.map((item2, index) =>
                          <Grid key={item2.code} item>
                            <Label className="document-header" indexNumber={index + 1} fontSize="12px" label={item2.code} />
                          </Grid>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                </div>
                <div>
                <Label className="document-header" fontSize="12px" color="rgba(0, 0, 0, 0.87"  label={item1.description} />
                </div>
              </div>
            )}

          </div>

          <div className="transfer-ownership-dialog-footer" style={{ marginTop: 10 }}>
            <Button
              label={<Label buttonLabel={true} label="PT_PRINT" fontSize="16px" color="#fe7a51" padding="0" lineHeight="25px !important" labelClassName="footer-button-label" />}
              buttonStyle={{ border: "1px solid #fe7a51", padding: 0 }}
              labelStyle={{ letterSpacing: 0.7, padding: 0, color: "#fe7a51" }}
              className="footer-button"
              onClick={() => { printDiv() }}
            />
            <Button
              label={<Label buttonLabel={true} label="PT_TRANFER_OWNERSHIP" fontSize="16px" lineHeight="25px !important" labelClassName="footer-button-label" />}
              primary={true}
              className="footer-button"
              labelStyle={{ letterSpacing: 0.7, padding: 0, color: "#fe7a51",lineHeight:"20px" }}
              buttonStyle={{ padding: 0 }}
              onClick={() => { navigateToRouteUrl(routeUrl) }}
            />
          </div>
        </div>
      ]}
      bodyStyle={bodyStyle}
      isClose={true}
      handleClose={closeDialogue}
      onRequestClose={closeDialogue}
      contentStyle={contentStyle}
      contentClassName="transfer-doc-required-content"
    />
  );


};

export default withStyles(styles)(withRouter(TransferOwnerShipDialog));
