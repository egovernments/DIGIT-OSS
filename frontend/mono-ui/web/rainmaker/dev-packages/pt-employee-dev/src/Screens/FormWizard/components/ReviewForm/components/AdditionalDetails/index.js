import React from "react";
import { Card, Icon } from "components";
// import TextField from "material-ui/TextField";
import Label from "egov-ui-kit/utils/translationNode";
import { TextField } from "components";
import "./index.css";

const styles = {
  labelStyle: {
    color: "#484848",
    letterSpacing: 0.7,
    marginLeft: 8
  },

  radioButtonItemStyle: {
    marginBottom: "18px",
    paddingLeft: "2px",
    height: "16px"
  },
  selectedLabelStyle: {
    color: "#fe7a51"
  },
  radioButtonLabelStyle: {
    lineHeight: 1,
    marginTop: "3px"
  }
};
const inputBaseStyle = {
  paddingBottom: 10,
  fontSize: "16px",
  color: "#484848",
  letterSpacing: "0.7px"
};
const floatingLabelBaseStyle = {
  top: 30,
  fontSize: "14px",
  letterSpacing: "0.6px"
};
const AdditionalDetails = ({
  optionSelected,
  handleFieldChange,
  onRadioButtonChange,
  value,
  errorText
}) => {
  return (
    <Card
    style={{
      backgroundColor: "rgb(242, 242, 242)"}}
      className="tax-calculation-card-header"
      textChildren={
        <div>
          <div
            className="rainmaker-displayInline"
            style={{ marginTop: 10, alignItems: "center" }}
          >
            {/* <Icon action="custom" name="rupee" /> */}
            <Label
              label="PT_PAY_AMOUNT_TO_BE_PAID"
              fontSize={16}
              bold={true}
              labelStyle={styles.labelStyle}
            />
          </div>
          <div className="clearfix">
            <div
              className="col-sm-6"
              style={{ paddingTop: 25, paddingLeft: 8 }}
            >
              <div className="property-amount-radio">
                <div className="amt-radio">
                  <input
                    style={{ marginRight: "4px 8px 0px 0px" }}
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
                    style={{ marginRight: "4px 8px 0px 0px" }}
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
              </div>
            </div>
            <div className="col-sm-6 amtToPay">
              <TextField
                id="amount-to-be-paid"
                onChange={(e, value) => handleFieldChange(e, value)}
                value={value}
                floatingLabelText={
                  <Label
                    label="PT_AMOUNT_TO_PAY_INR"
                    color="rgba(0,0,0,0.60)"
                  />
                }
                floatingLabelShrinkStyle={{
                  fontSize: "12px",
                  transform: "scale(1) translate(0px, -16px)",
                  fontWeight: 500,
                  zIndex: 0
                }}
                floatingLabelFixed={true}
                inputStyle={inputBaseStyle}
                floatingLabelStyle={floatingLabelBaseStyle}
                underlineFocusStyle={{ borderColor: "#e0e0e0" }}
                disabled={optionSelected === "Full_Amount"}
                required={true}
                errorText={errorText}
                underlineDisabledStyle={{ borderBottom: "1px solid #e0e0e0" }}
              />
            </div>
          </div>
          {optionSelected && optionSelected === "Partial_Amount" && (
            <div
              className="rainmaker-displayInline"
              style={{
                padding: "12px 0px 12px 12px",
                backgroundColor: "#f2f2f2",
                marginTop: 10,
                border: "1px solid #5aaafa",
                borderLeft: "5px solid #5aaafa"
              }}
            >
              <Icon action="action" name="info" color="#30588c" />
              <Label
                containerStyle={{ marginLeft: 16 }}
                fontSize="14px"
                color="#484848"
                label="PT_PAYMENTAMOUNT_PARTIALPAY_NOREBATE"
              />
            </div>
          )}
        </div>
      }
    />
  );
};

export default AdditionalDetails;
