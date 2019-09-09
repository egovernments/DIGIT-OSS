import React, { Component } from "react";

import Label from "utils/translationNode";
import FloatingActionButton from "material-ui/FloatingActionButton";
import "./index.css";

class SuccessMessage extends Component {
  render() {
    const { successmessage, secondaryLabel, tertiaryLabel, icon, backgroundColor } = this.props;
    return (
      <div className="success-message-main-cont ">
        <div className="success-message-inner-cont">
          <div className="success-message-icon-cont">
            <FloatingActionButton className="floating-button" style={{ boxShadow: 0 }} backgroundColor={backgroundColor}>
              {icon}
            </FloatingActionButton>
          </div>
          <Label className="thankyou-text" label={successmessage} color="#767676" />
          <Label className="secondary-text" label={secondaryLabel} color="#767676" />
          <Label className="tertiary-text" label={tertiaryLabel} color="#767676" />
        </div>
      </div>
    );
  }
}

export default SuccessMessage;
