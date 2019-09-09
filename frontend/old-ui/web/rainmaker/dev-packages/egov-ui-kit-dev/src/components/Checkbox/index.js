import React from "react";
import PropTypes from "prop-types";
import Checkbox from "material-ui/Checkbox";
import Label from "../../utils/translationNode";
import "./index.css";

const defaultLabelStyle = {};

const defaultStyle = {
  marginBottom: "21px",
};

const selectedIconStyle = {
  fill: "#fe7a51",
};

const CheckboxUi = ({ options, labelStyle, onCheck, style = {}, checkedIcon, iconStyle, containerClassName, selected, id }) => {
  const renderCheckboxOptions = () => {
    return options.map((option, index) => {
      return (
        <Checkbox
          key={index}
          id={id + index}
          value={option.value}
          label={<Label color={selected.indexOf(option.value) > -1 ? "#fe7a51" : "#767676"} label={option.label} />}
          onCheck={() => {
            onCheck(option.value);
          }}
          style={{ ...defaultStyle, ...style }}
          iconStyle={selected.indexOf(option.value) > -1 ? selectedIconStyle : iconStyle}
          checkedIcon={checkedIcon}
          selected={selected}
          labelStyle={{ ...defaultLabelStyle, ...labelStyle }}
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
