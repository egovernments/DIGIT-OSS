import React from "react";
import PropTypes from "prop-types";
import "./index.css";

const labelText = (label, labelStyle, labelClassName, required, secondaryText, isConcat, dynamicValue, dynamicArray,indexNumber) => {
  //   return isConcat ? (
  //     label && dynamicValue ? (
  //       <div data-localization={`${label}${dynamicValue}`} className="rainmaker-displayInline">
  //         <span style={labelStyle}>{label}</span>
  //         <span style={labelStyle}>{dynamicValue}</span>
  //       </div>
  //     ) : (
  //       ""
  //     )
  //   ) : label && label.length ? (
  //     <div data-localization={label} className={`label-text ${labelClassName}`} style={labelStyle}>
  //       {label} {secondaryText}
  //       {required && <span style={{ color: "red" }}> *</span>}
  //     </div>
  //   ) : (
  //     ""
  //   );
  // };

  if (label && label.length) {
    if (dynamicArray) {
      if (label) {
        let displayLabel = label;
        if (dynamicArray.length > 1) {
          dynamicArray.forEach((item, index) => {
            displayLabel = displayLabel.replace(new RegExp("\\{" + index + "\\}", "gm"), item);
          });
        } else {
          let index = 0;
          displayLabel = displayLabel.replace(new RegExp("\\{" + index + "\\}", "gm"), dynamicArray[0]);
        }

        return (
          <div data-localization={displayLabel} className={`label-text ${labelClassName}`} style={labelStyle}>
            <span style={labelStyle}>{displayLabel}</span>
          </div>
        );
      }
    } else {
      return (
        <div data-localization={label} className={`label-text ${labelClassName}`} style={labelStyle}>
          {indexNumber&& <span>{indexNumber}.</span>} {label} {secondaryText} 
          {required && <span style={{ color: "red" }}> *</span>}
        </div>
      );
    }
  } else {
    return "";
  }
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
  required,
  dynamicValue,
  dynamicArray,
  isConcat,
  indexNumber,
  secondaryText = "",
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
      {labelText(label, labelStyle, labelClassName, required, secondaryText, isConcat, dynamicValue, dynamicArray,indexNumber)}
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
  indexNumber:PropTypes.number
};

export default Label;
