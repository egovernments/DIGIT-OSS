import React from "react";
import "./index.css";
import Label from "egov-ui-kit/utils/translationNode";

const RadioButtonForm = ({ label, form, handleFieldChange, selectedYear, handleRadioButton, history, resetFormWizard, urlToAppend }) => {
  const fields = form.fields || {};
  return (

    <div className="property-amount-radio">
      <div className="amt-radio">
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
        />
      </div>
    </div>

  );
};

export default RadioButtonForm;
