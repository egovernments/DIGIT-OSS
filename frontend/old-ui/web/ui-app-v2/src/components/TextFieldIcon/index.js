import React from "react";
import PropTypes from "prop-types";
// can we pull the existing textfield
import TextField from "../TextField";

const containerStyle = {
  position: "relative",
  display: "inline-block",
  width: "100%",
  boxSizing: "border-box",
  fontSize: 0,
};

const getStyles = (iconPosition, textFieldProps) => {
  const textFieldStyle = {},
    inputStyle = {};

  const iconStyle = {
    position: "absolute",
    color: "#969696",
    zIndex: 2,
    bottom: 0,
    top: 0,
    margin: "auto",
  };
  iconStyle[iconPosition === "before" ? "left" : "right"] = 0;
  textFieldStyle["textIndent"] = iconPosition === "before" ? 40 : 0;
  inputStyle["width"] = iconPosition === "after" ? "90%" : "100%";

  if (textFieldProps.floatingLabelText) {
    iconStyle.top = 30;
  }

  return {
    iconStyle,
    textFieldStyle,
    inputStyle,
  };
};

const TextFieldIcon = ({ Icon, iconStyle = {}, onClick, textFieldStyle = {}, iconPosition = "after", autoFocus, className, ...textFieldProps }) => {
  const style = getStyles(iconPosition, textFieldProps);
  return (
    <div onClick={onClick} style={containerStyle}>
      <Icon style={{ ...style.iconStyle, ...iconStyle }} />
      <TextField
        autoFocus={autoFocus}
        name="textfield-icon"
        className={className}
        style={{ ...style.textFieldStyle, ...textFieldStyle }}
        inputStyle={{ ...style.inputStyle }}
        {...textFieldProps}
      />
    </div>
  );
};

TextFieldIcon.propTypes = {
  onClick: PropTypes.func,
  iconPosition: PropTypes.string,
  textFieldStyle: PropTypes.object,
  iconProps: PropTypes.object,
  iconStyle: PropTypes.object,
};

export default TextFieldIcon;
