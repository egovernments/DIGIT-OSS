import React, { Component } from "react";
import { Button, Icon } from "components";
import Label from "utils/translationNode";
import SuccessMessage from "modules/common/common/SuccessMessage/components/successmessage";
import "modules/common/common/SuccessMessage/components/successmessage/index.css";
import "./index.css";

class ResolveSuccess extends Component {
  continueComplaintSubmit = () => {
    this.props.history.push("/employee/all-complaints");
  };
  render() {
    return (
      <div className="success-message-main-screen resolve-success">
        <SuccessMessage
          successmessage="ES_COMPLAINT_RESOLVED_SUCCESS_MESSAGE"
          secondaryLabel="CS_COMMON_RESOLVED"
          containerStyle={{ display: "inline-block" }}
          icon={<Icon action="navigation" name="check" />}
          backgroundColor={"#22b25f"}
        />
        <div className="btn-without-bottom-nav">
          <Button
            id="resolve-success-continue"
            primary={true}
            label={<Label buttonLabel={true} label="CORE_COMMON_GOTOHOME" />}
            fullWidth={true}
            onClick={this.continueComplaintSubmit}
          />
        </div>
      </div>
    );
  }
}

export default ResolveSuccess;
