import React, { Component } from "react";
import { Button } from "components";
import Label from "utils/translationNode";
import "./index.css";

class ActionButton extends Component {
  render() {
    let { btnOneLabel, btnOneOnClick, btnTwoLabel, btnTwoOnClick } = this.props;
    return (
      <div className="compalint-details-action-buttons">
        <Button
          label={<Label buttonLabel={true} label={btnOneLabel} color="#fe7a51" />}
          onClick={btnOneOnClick}
          className="action-button-one"
          id="actionOne"
          backgroundColor="#ffffff"
          labelStyle={{ padding: 0 }}
          overlayStyle={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        />
        <Button
          label={<Label buttonLabel={true} label={btnTwoLabel} />}
          onClick={btnTwoOnClick}
          className="action-button-two"
          id="actionTwo"
          labelStyle={{ padding: 0 }}
          overlayStyle={{ display: "flex", alignItems: "center", justifyContent: "center" }}
          backgroundColor="#fe7a51"
        />
      </div>
    );
  }
}

export default ActionButton;
