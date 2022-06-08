import React, { Component } from "react";
import { Button, Icon } from "components";
import Label from "utils/translationNode";
import SuccessMessage from "modules/common/common/SuccessMessage/components/successmessage";
import "modules/common/common/SuccessMessage/components/successmessage/index.css";

class ComplaintRejected extends Component {
  handleComplaintReassigned = () => {
    this.props.history.push("/employee/all-complaints");
  };

  render() {
    return (
      <div className="success-message-main-screen">
        <SuccessMessage
          successmessage="ES_COMPLAINT_REJECT_SUCCESS_MESSAGE"
          icon={<Icon action="navigation" name="close" />}
          backgroundColor={"#e74c3c"}
        />

        <div className="btn-without-bottom-nav">
          <Button
            id="resolve-success-continue"
            primary={true}
            label={<Label buttonLabel={true} label="CORE_COMMON_GOTOHOME" />}
            fullWidth={true}
            onClick={this.handleComplaintReassigned}
          />
        </div>
      </div>
    );
  }
}

export default ComplaintRejected;
