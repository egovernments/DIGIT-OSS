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
        className="pt-update-popup"
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
          backgroundColor: "white"
        }}
      >
        <div className="pt-update-popup-holder">

          <Label label="PTUPNO_INVALIDNO_DESC" labelStyle={{ color: 'rgba(0, 0, 0, 0.873302)', fontSize: "14px" }}></Label>

          {<div className="pt-update-verify-container">

            <button type="button" style={{ width: '100%' }} className={"button-verify-link"} onClick={() => console.log("asdasda")} ><Label label="PTUPNO_INVALIDNO_UPDATE"></Label></button>
            <button type="button" style={{ width: '100%' }} className={"button-verify-link"} onClick={() => console.log("asdasda")} ><Label label="PTUPNO_INVALIDNO_SKIP"></Label></button>
          </div>}
        </div>
        {errorMessage && <div className={type == "ERROR" ? "error-comp-second-num" : "success-comp-second-num"}><Label label={errorMessage}></Label></div>}
      </Dialog>
    )
  }
}
