import React, { Component } from "react";
import { Button, Icon } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import { SuccessMessage } from "modules/common";

class ReassignSuccess extends Component {
  continueComplaintSubmit = () => {
    this.props.history.push("/all-complaints");
  };
  render() {
    return (
      <div className="success-message-main-screen">
        <SuccessMessage
          successmessage="ES_REASSIGN_REQUEST_SUCCESS_MESSAGE"
          icon={<Icon action="navigation" name="check" />}
          backgroundColor={"#22b25f"}
        />

        <div className="responsive-action-button-cont">
          <Button
            id="resolve-success-continue"
            primary={true}
            label={<Label buttonLabel={true} label="CORE_COMMON_GOTOHOME" />}
            fullWidth={true}
            onClick={this.continueComplaintSubmit}
            className="responsive-action-button"
          />
        </div>
      </div>
    );
  }
}

export default ReassignSuccess;
