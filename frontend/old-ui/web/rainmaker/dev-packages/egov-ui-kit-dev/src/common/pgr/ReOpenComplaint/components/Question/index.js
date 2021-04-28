import React, { Component } from "react";
import { RadioButton } from "components";
import Label from "egov-ui-kit/utils/translationNode";

const styles = {
  labelStyle: {
    fontSize: "14px",
    fontWeight: "normal",
    color: "#767676",
    letterSpacing: "0.3px",
    marginBottom: "26px",
  },

  radioButtonItemStyle: {
    marginBottom: "18px",
    paddingLeft: "2px",
    height: "16px",
  },
  selectedLabelStyle: {
    color: "#fe7a51",
  },
  radioButtonLabelStyle: {
    fontSize: "14px",
    fontWeight: "400",
    color: "#767676",
    letterSpacing: "0.3px",
  },
};
class Question extends Component {
  render() {
    let { options, label, handleChange, valueSelected } = this.props;

    return (
      <div>
        <Label label={label} labelStyle={styles.labelStyle} />
        <RadioButton
          id="reopencomplaint-radio-button"
          name="reopencomplaint-radio-button"
          valueSelected={valueSelected}
          options={options}
          handleChange={handleChange}
          radioButtonItemStyle={styles.radioButtonItemStyle}
          labelStyle={styles.radioButtonLabelStyle}
          selectedLabelStyle={styles.selectedLabelStyle}
        />
      </div>
    );
  }
}

export default Question;
