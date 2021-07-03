import React from "react";
import PropTypes from "prop-types";
import SearchIcon from "material-ui/svg-icons/action/search";
import { Hidden } from '@material-ui/core';
// can we pull the existing textfield
import Label from "../../utils/translationNode";
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
    cursor: "pointer"
  };
  iconStyle[iconPosition === "before" ? "left" : "right"] = 0;
  textFieldStyle["textIndent"] = iconPosition === "before" ? 40 : 0;
  inputStyle["width"] = iconPosition === "after" ? "90%" : "90%";

  if (textFieldProps.floatingLabelText) {
    iconStyle.top = 24;
  }

  return {
    iconStyle,
    textFieldStyle,
    inputStyle,
  };
};

const TextFieldIcon = ({
  Icon,
  iconStyle = {},
  text,
  onClick,
  onIconClick,
  textFieldStyle = {},
  iconPosition = "after",
  autoFocus,
  className,
  inputStyle,
  disabled,
  ...textFieldProps
}) => {
  const TargetIcon = Icon || SearchIcon;
  const style = getStyles(iconPosition, textFieldProps);
  return (
    <div onClick={onClick} style={containerStyle}>
      {text ? (
        <div onClick={onIconClick} style={{ cursor: "pointer" }}>
          <Hidden only={['sm', 'lg','xl','md']}>
          <TargetIcon onClick={onIconClick} style={{ ...style.iconStyle, ...iconStyle }} />
          </Hidden>
          <Hidden only='xs'>
          <Label className="textfield-text" label={text} labelStyle={{ ...style.iconStyle, ...iconStyle, top: 36 }} />
          </Hidden>
        </div>
      ) : (
        <div onClick={onIconClick} style={{ cursor: "pointer" }}>
        <Hidden only={['sm', 'lg','xl','md']}>
        <TargetIcon onClick={onIconClick} style={{ ...style.iconStyle, ...iconStyle  }} />
        </Hidden>
        <Hidden only='xs'>
        <TargetIcon onClick={onIconClick} style={{ ...style.iconStyle, ...iconStyle }} />
        </Hidden>
      </div>
      )}
      <TextField
        autoFocus={autoFocus}
        name="textfield-icon"
        className={className}
        style={{ ...style.textFieldStyle, ...textFieldStyle }}
        inputStyle={{ ...style.inputStyle, ...inputStyle }}
        disabled={disabled}
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
