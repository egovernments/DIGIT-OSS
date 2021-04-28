import React from "react";
import DatePicker from "material-ui/DatePicker";
import "./index.css";
import PropTypes from "prop-types";

const hintBaseStyle = {
  fontSize: "16px",
  letterSpacing: "0.7px",
  color: "rgba(0, 0, 0, 0.3799999952316284)",
};

const floatingLabelBaseStyle = {
  top: 30,
  fontSize: "14px",
  letterSpacing: "0.6px",
};

const floatingLabelBaseShrinkStyle = {
  fontSize: "12px",
  color: "#00bcd1",
  transform: "scale(1) translate(0px, -16px)",
  fontWeight: 500,
  zIndex: 0,
};

const inputBaseStyle = {
  paddingBottom: 10,
  fontSize: "16px",
  color: "#484848",
  letterSpacing: "0.7px",
};

const requiredStyle = {
  color: "red",
};

const underlineDisabledStyle = {
  borderBottom: "1px solid #e0e0e0",
};

const underlineFocusBaseStyle = {
  borderColor: "#e0e0e0",
};

const DatePickerUi = ({
  style,
  onChange,
  id,
  disabled,
  floatingLabelStyle = {},
  hintText,
  errorText,
  errorStyle = {},
  fullWidth = true,
  hintStyle = {},
  className = "",
  value = "",
  floatingLabelText,
  underlineShow = true,
  inputStyle = {},
  underlineFocusStyle = {},
  required,
  type,
  autoFocus,
  maxLength,
  multiLine,
  ErrorText,
  formatDate,
  errorMessage,
  dropDownData,
  dataFetchConfig,
  jsonPath,
  toolTip,
  updateDependentFields,
  toolTipMessage,
  textFieldStyle,
  ...rest
}) => {
  return (
    <DatePicker
      errorText={errorText}
      errorStyle={errorStyle}
      value={value}
      onChange={onChange}
      disabled={disabled}
      inputStyle={{ ...inputBaseStyle, ...inputStyle }}
      className={`textfield ${className}`}
      formatDate={formatDate}
      style={style}
      id={id}
      floatingLabelShrinkStyle={floatingLabelBaseShrinkStyle}
      fullWidth={fullWidth}
      hintText={hintText}
      hintStyle={{ ...hintBaseStyle, ...hintStyle }}
      floatingLabelText={[
        floatingLabelText,
        required ? (
          <span key={`error-${className}`} style={requiredStyle}>
            {" "}
            *
          </span>
        ) : null,
      ]}
      floatingLabelStyle={{ ...floatingLabelBaseStyle, ...floatingLabelStyle }}
      underlineFocusStyle={{ ...underlineFocusBaseStyle, underlineFocusStyle }}
      underlineShow={underlineShow}
      floatingLabelFixed={true}
      type={type}
      autoFocus={autoFocus}
      maxLength={maxLength}
      textFieldStyle={textFieldStyle}
      autoComplete={type === "password" ? "new-password" : "off"}
      multiLine={multiLine}
      underlineDisabledStyle={underlineDisabledStyle}
      {...rest}
    />
  );
};

export default DatePickerUi;

DatePickerUi.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};
