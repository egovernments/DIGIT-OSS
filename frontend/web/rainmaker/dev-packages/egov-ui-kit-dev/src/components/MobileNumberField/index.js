import React from "react";
import PropTypes from "prop-types";
import TextField from "../TextField";

const containerStyle = {
  position: "relative",
  display: "inline-block",
  width: "100%",
  boxSizing: "border-box",
};

const textFieldBaseStyle = {
  textIndent: 35,
};

// const inputBaseStyle = {
//   width: "80% ! important",
//   paddingBottom: 10,
//   fontSize: "16px",
//   color: "#484848",
//   letterSpacing: "0.7px",
// };
// // const inputStyle = {
// //   //width: "80% ! important"
// // };

const prefixBaseStyle = {
  position: "absolute",
  color: "#969696",
  zIndex: 2,
  top: 36,
  paddingRight: 5,
  borderRight: "1px solid #eee",
};

const floatingLabelStyle = {
  left: -35,
};

const MobileNumberField = ({ className, textFieldStyle = {}, prefix = "+91", prefixStyle = {}, jsonPath, errorMessage, ...textFieldProps }) => {
  
  return (
    <div style={containerStyle}>
      <div style={{ ...prefixBaseStyle, ...prefixStyle }}>{prefix}</div>
      <TextField
        className={`mobile-number-field ${className}`}
        id="mobile-number-field"
        name="mobile-number-field"
        InputProps={{
          maxLength: 10,
          minLength: 10,
        }}
        errorStyle={{ marginLeft: "-35px" }}
    inputStyle={{width:"85%" }}
        style={{ ...textFieldBaseStyle, ...textFieldStyle }}
        {...textFieldProps}
        floatingLabelStyle={floatingLabelStyle}
        type="number"
      />
    </div>
  );
};

MobileNumberField.propTypes = {
  textFieldStyle: PropTypes.object,
  prefixStyle: PropTypes.object,
  prefix: PropTypes.string,
};

export default MobileNumberField;
