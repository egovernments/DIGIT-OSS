import React from "react";
import "./index.css";
import Label from "egov-ui-kit/utils/translationNode";

const labelContainerStyle = {
  marginTop: window.screen.width>768?"-2px":"3px"
}

const RadioButtonForm = ({ label, form, handleFieldChange, selectedYear, handleRadioButton, history, urlToAppend }) => {
  const fields = form.fields || {};
  return (
    <div className="property-amount-radio">
      <div className="amt-radio" style={{ padding: '5px' }}>
        <input
          type="radio"
          onClick={handleRadioButton}
          checked={selectedYear === label}
          value={label}
          name="radio"
        />
        <Label
          label={label}
          fontSize="18px"
          color="#484848"
          containerStyle={labelContainerStyle}
        />
      </div>
    </div>
  );
};

export default RadioButtonForm;
