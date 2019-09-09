import React from "react";
import PropTypes from "prop-types";
import "./index.css";

const labelText = (label, labelStyle, labelClassName) => {
  return label && label.length ? (
    <div className={`label-text ${labelClassName}`} style={labelStyle}>
      {label}
    </div>
  ) : (
    ""
  );
};

const Label = ({
  className = "",
  label,
  color,
  fontSize = 14,
  dark = false,
  upperCase = false,
  bold = false,
  containerStyle = {},
  labelStyle = {},
  labelClassName = "",
  buttonLabel = false,
  id,
}) => {
  let additionalStyles = {};

  if (color) {
    additionalStyles.color = color;
  }
  if (!color && buttonLabel) {
    additionalStyles.color = "#ffffff";
  }
  if (dark) {
    additionalStyles.color = "#484848";
  }
  if (bold) {
    additionalStyles.fontWeight = 500;
  }
  if (fontSize) {
    additionalStyles.fontSize = fontSize;
  }
  if (upperCase) {
    additionalStyles.textTransform = "uppercase";
  }

  if (Object.keys(labelStyle).length || Object.keys(additionalStyles).length) {
    labelStyle = Object.assign({}, labelStyle, additionalStyles);
  }

  return (
    <div id={id} style={containerStyle} className={buttonLabel ? `button-label-container ${className}` : `label-container ${className}`}>
      {labelText(label, labelStyle, labelClassName)}
    </div>
  );
};

Label.propTypes = {
  label: PropTypes.string,
  color: PropTypes.string,
  bold: PropTypes.bool,
  upperCase: PropTypes.bool,
  className: PropTypes.string,
  containerStyle: PropTypes.object,
  labelStyle: PropTypes.object,
  labelClassName: PropTypes.string,
};

export default Label;
