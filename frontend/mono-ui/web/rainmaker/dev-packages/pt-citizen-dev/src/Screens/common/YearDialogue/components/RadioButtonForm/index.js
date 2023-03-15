import React from "react";
import { Button } from "components";
import "./index.css";
import Label from "egov-ui-kit/utils/translationNode";

const labelContainerStyle = {
  marginTop: window.screen.width>768?"-2px":"3px"
}

const RadioButtonForm = ({ label, form, handleFieldChange, selectedYear, handleRadioButton, history, resetFormWizard, urlToAppend }) => {
  const fields = form.fields || {};
  return (
    // <Button
    //   {...fields.button}
    //   onClick={() => {
    //     handleFieldChange("button", label);
    //     resetFormWizard();

    //     history && urlToAppend ? history.push(`${urlToAppend}&FY=${label}`) : history.push(`/property-tax/assessment-form?FY=${label}&type=new`);
    //   }}
    //   className="year-range-button"
    //   label={label}
    //   labelColor="#fe7a51"
    //   buttonStyle={{ borderRadius: "50px", border: "1px solid #fe7a51" }}
    // />
    <div className="property-amount-radio">
      <div className="amt-radio" style={{ padding: '5px' }}>
        <input
          type="radio"
          // checked={optionSelected === "Full_Amount"}
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
{/* <div className="property-amount-radio">
<div className="amt-radio">
  <input
    type="radio"
    checked={optionSelected === "Full_Amount"}
    onClick={onRadioButtonChange}
    value="Full_Amount"
    name="radio"
  />
  <Label
    label="PT_FULL_AMOUNT"
    color="#4848484"
    labelStyle={styles.radioButtonLabelStyle}
  />
</div>
<div className="amt-radio">
  <input
    type="radio"
    checked={optionSelected === "Partial_Amount"}
    onClick={onRadioButtonChange}
    value="Partial_Amount"
    name="radio"
  />
  <Label
    label="PT_PARTIAL_AMOUNT"
    color="#4848484"
    labelStyle={styles.radioButtonLabelStyle}
  />
</div>
</div> */}

// onRadioButtonChange = e => {
//   let { estimationDetails } = this.props;
//   let { totalAmount } = estimationDetails[0] || {};
//   if (e.target.value === "Full_Amount") {
//     this.setState(
//       {
//         totalAmountTobePaid: totalAmount,
//         valueSelected: "Full_Amount",
//         errorText: ""
//       },
//       () => {
//         this.updateTotalAmount(this.props.totalAmountToBePaid);
//       }
//     );
//   }
