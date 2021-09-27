import React, { Component } from "react";
import { Button } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import "./index.css";

class ActionButton extends Component {
  render() {
    let { btnOneLabel, btnOneOnClick, btnTwoLabel, btnTwoOnClick } = this.props;
    const defaultButtonStyle = {
      height: "48px",
      width: "100%",
      lineHeight: "48px",
    };
    const button1Style = {
      border: "1px solid #fe7a51",
      marginRight: 16,
    };
    const button2Style = {};
    return (
      <div className="complaint-details-action-buttons">
        {btnOneLabel && (
          <Button
            label={<Label buttonLabel={true} label={btnOneLabel} color="#fe7a51" />}
            onClick={btnOneOnClick}
            className="action-button-one"
            id="actionOne"
            backgroundColor="#ffffff"
            labelStyle={{ padding: 0 }}
            overlayStyle={{ display: "flex", alignItems: "center", justifyContent: "center", height: "inherit" }}
            buttonStyle={{ ...defaultButtonStyle, ...button1Style }}
          />
        )}

        <Button
          label={<Label buttonLabel={true} label={btnTwoLabel} />}
          onClick={btnTwoOnClick}
          className="action-button-two"
          id="actionTwo"
          labelStyle={{ padding: 0 }}
          overlayStyle={{ display: "flex", alignItems: "center", justifyContent: "center", height: "inherit" }}
          backgroundColor="#fe7a51"
          buttonStyle={{ ...defaultButtonStyle, ...button2Style }}
        />
      </div>
    );
  }
}

export default ActionButton;
