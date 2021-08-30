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
const CheckboxUi = ({ options, defaultValue, labelStyle, onCheck, style = {}, checkedIcon, iconStyle, containerClassName, selected, id }) => {
  const renderCheckboxOptions = () => {
    return options.map((option, index) => {
      return (
        <Checkbox
          key={index}
          id={id + index}
          value={option.value}
          label={option.label}
          onCheck={() => {
            onCheck(option.value);
          }}
          style={{ ...defaultStyle, ...style }}
          iconStyle={iconStyle}
          checkedIcon={checkedIcon}
          selected={selected}
          labelStyle={
            selected.indexOf(option.label) > -1
              ? { ...defaultLabelStyle, ...labelStyle, ...selectedLabelStyle }
              : { ...defaultLabelStyle, ...labelStyle }
          }
        />
      );
    });
  };

  return <div className={`${containerClassName} checkbox-container`}>{renderCheckboxOptions()}</div>;
};

CheckboxUi.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.node.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }).isRequired
  ),
  defaultValue: PropTypes.string,
  onCheck: PropTypes.func,
  style: PropTypes.object,
};

export default CheckboxUi;
