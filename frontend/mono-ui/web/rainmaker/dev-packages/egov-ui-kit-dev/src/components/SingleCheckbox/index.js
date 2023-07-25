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
}) => {
  const renderCheckbox = () => {
    return (
      <Checkbox
        id={id}
        defaultValue={defaultValue}
        label={floatingLabelText}
        onCheck={onCheck}
        style={{ ...defaultStyle, ...style }}
        iconStyle={iconStyle}
        checked={typeof value === "boolean" ? value : value === "true" ? true : false}
        checkedIcon={checkedIcon}
        labelStyle={{ ...defaultLabelStyle, ...labelStyle, ...selectedLabelStyle }}
        disabled={disabled}
      />
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
