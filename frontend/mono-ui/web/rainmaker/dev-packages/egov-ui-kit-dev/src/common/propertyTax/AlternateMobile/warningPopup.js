import { Dialog } from "components";
import { routeToCommonPay } from "egov-ui-kit/utils/PTCommon/FormWizardUtils/formUtils";
import Label from "egov-ui-kit/utils/translationNode";
import React from "react";
import "./index.css";
import { setRoute } from "egov-ui-kit/utils/commons";

export default class WarningPopup extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { propertyId = "", tenantId = "",UpdateNumber ={},link} = this.props;
    const {documents=[]}=UpdateNumber;
    return (
      <Dialog
        className="pt-warning-popup"
        open={this.props.open}
        isClose={true}
        title={<Label label="PTUPNO_INVALIDNO_HEADER" fontSize="24px" labelStyle={{ padding: "2%", backgroundColor: "white", paddingLeft: '4%' }} labelClassName="owner-history" />}
        handleClose={this.props.closeDialog}
        titleStyle={{
          padding: "2%",
          backgroundColor: "white"

        }}
        actionsContainerStyle={{
          padding: "2%",
          backgroundColor: "white"
        }}
        bodyStyle={{
          padding: "0% 2% 2% 2%",
          backgroundColor: "white",
        }}
      >

        <div style={{ padding: '10px' }}><span style={{ display: "flex", marginTop: "10px", marginBottom: '10px' , flexDirection: "column" }}>           <Label label="PT_ALT_INVALIDNO" labelStyle={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: "14px" }}></Label>
                <Label label="PT_ALT_CONTACT_ULB" labelStyle={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: "14px" }}></Label>
                <Label label="PT_ALT_CARRY_DOCS" labelStyle={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: "14px" }}></Label>
              </span>
              {documents.map(doc => {
                return <Label label={`ALT_${doc.code}`} labelStyle={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: "14px" }}></Label>
              })}</div>
        <div className="pt-warning-button-container">

          <button type="button" style={{ width: '100%' }} className={"button-verify-link"} onClick={() => { this.props.closeDialog();setRoute(link) }} ><Label label="PTUPNO_CONT_TO_PAY"></Label></button>

        </div>

      </Dialog>
    )
  }
}
