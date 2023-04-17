import React from "react";
import PropTypes from "prop-types";
import Checkbox from "material-ui/Checkbox";
import "./index.css";

const defaultLabelStyle = {
  fontFamily: "Roboto, sans-serif",
};

const defaultStyle = {
  marginBottom: "21px",
};

const selectedLabelStyle = {
  color: "#00bcd1",
};
const checkBoxWidth = {
  width: "20px",
  display: "inline-block"
}


const SingleCheckboxUi = ({
  defaultValue,
  value,
  floatingLabelText,
  labelStyle,
  onCheck,
  style = {},
  checkedIcon,
  iconStyle,
  containerClassName,
  id,
  disabled,
  isSeperateLabel = "",
}) => {
  const renderCheckbox = () => {
    return (
      <div style={isSeperateLabel ? {display: "flex", justifyContent: "flex-start", alignItems: "center", marginTop: "-20px", marginLeft: "-3px"} : {}}>
        <Checkbox
        id={id}
        defaultValue={defaultValue}
        label={isSeperateLabel ? "" : floatingLabelText}
        onCheck={onCheck}
        style={isSeperateLabel ? { ...defaultStyle, ...style, ...checkBoxWidth } : { ...defaultStyle, ...style }}
        iconStyle={iconStyle}
        checked={typeof value === "boolean" ? value : value === "true" ? true : false}
        checkedIcon={checkedIcon}
        labelStyle={{ ...defaultLabelStyle, ...labelStyle, ...selectedLabelStyle }}
        disabled={disabled}
      />
      {isSeperateLabel && <span style={{marginTop: "10px", marginLeft: "10px"}}>{isSeperateLabel}</span>}
      </div>
    );
  };

  return <div className={`${containerClassName} checkbox-container`}>{renderCheckbox()}</div>;
};

SingleCheckboxUi.propTypes = {
  floatingLabelText: PropTypes.node.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
  defaultValue: PropTypes.string,
  onCheck: PropTypes.func,
  style: PropTypes.object,
};

export default SingleCheckboxUi;
