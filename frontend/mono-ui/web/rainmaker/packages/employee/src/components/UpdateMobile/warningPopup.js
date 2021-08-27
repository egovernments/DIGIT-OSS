import { Dialog } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import React from "react";
import "./index.css";



export default class WarningPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }


  render() {

    const { fields = {}, error = {}, documents, fileUploadingStatus } = this.state;
    const { errorMessage = "", type = "" } = error;

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
        <div className="pt-update-popup-holder" style={{ paddingTop: "10px" }}>

          <Label label="PTUPNO_INVALIDNO_DESC" labelStyle={{ color: 'rgba(0, 0, 0, 0.873302)', fontSize: "14px" }}></Label>

          {<div className="pt-warning-button-container">

            <button type="button" style={{ width: '48%' }} className={"button-warning-secondary"} onClick={() => { this.props.updateNum(); }} ><Label label="PTUPNO_INVALIDNO_UPDATE"></Label></button>
            <button type="button" style={{ width: '48%' }} className={"button-verify-link"} onClick={() => this.props.closeDialog()} ><Label label="PTUPNO_INVALIDNO_SKIP"></Label></button>
          </div>}
        </div>
        {errorMessage && <div className={type == "ERROR" ? "error-comp-second-num" : "success-comp-second-num"}><Label label={errorMessage}></Label></div>}
      </Dialog>
    )
  }
}
