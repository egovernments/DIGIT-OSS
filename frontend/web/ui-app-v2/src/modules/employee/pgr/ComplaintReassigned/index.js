import React, { Component } from "react";
import { Button, Icon } from "components";
import Label from "utils/translationNode";
import SuccessMessage from "modules/common/common/SuccessMessage/components/successmessage";
import "modules/common/common/SuccessMessage/components/successmessage/index.css";

class ComplaintReassigned extends Component {
  handleComplaintReassigned = () => {
    this.props.history.push("/employee/all-complaints");
  };

  render() {
    let designation = "Senior Inspector";
    let department = "Health & Sanitation Department";
    return (
      <div className="success-message-main-screen">
        <SuccessMessage
          successmessage="Re-assigned to Amrinder Singh"
          secondaryLabel={designation}
          tertiaryLabel={department}
          icon={<Icon action="navigation" name="check" />}
          backgroundColor={"#22b25f"}
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

export default ComplaintReassigned;
