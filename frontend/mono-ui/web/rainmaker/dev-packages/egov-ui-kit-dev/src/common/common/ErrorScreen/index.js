import React, { Component } from "react";
import { Button, Icon } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import { SuccessMessage } from "modules/common";
import "./index.css";

class ErrorScreen extends Component {
  handleErrorScreen = () => {
    console.log("error screen");
  };

  render() {
    return (
      <div className="error-screen-main-container">
        <div className="success-message-main-screen">
          <SuccessMessage
            successmessage="ES_COMPLAINT_REJECT_SUCCESS_MESSAGE"
            icon={<Icon action="alert" name="error" style={{ backgroundColor: "#ffffff", fill: "#e74c3c", width: "56px" }} />}
            backgroundColor={"#e74c3c"}
          />

          <div className="success-message-continue">
            <Button
              id="resolve-success-continue"
              primary={true}
              label={<Label buttonLabel={true} label="CORE_COMMON_GOTOHOME" />}
              fullWidth={true}
              onClick={this.handleErrorScreen}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorScreen;
