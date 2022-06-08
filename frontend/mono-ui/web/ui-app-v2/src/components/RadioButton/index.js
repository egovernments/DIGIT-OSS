import React from "react";
import { RadioButton, RadioButtonGroup } from "material-ui/RadioButton";

const RadioButtonUi = ({
  options,
  valueSelected,
  className,
  name,
  defaultValue,
  style = {},
  radioButtonItemStyle = {},
  labelItemStyle = {},
  labelStyle = {},
  selectedStyle = {},
  handleChange,
  checkedIcon,
  iconStyle,
  selectedLabelStyle,
  id,
}) => {
  const renderRadioButtons = () => {
    return options.map((option, index) => {
      const { value, label } = option;
      return (
        <RadioButton
          key={index}
          id={id + "-" + index}
          style={value === valueSelected ? { ...radioButtonItemStyle, ...selectedStyle } : radioButtonItemStyle}
          value={value}
          label={label}
          labelStyle={value === valueSelected ? { ...labelStyle, ...selectedLabelStyle } : labelStyle}
          iconStyle={iconStyle}
          checkedIcon={checkedIcon}
        />
      );
    });
  };

  return (
    <RadioButtonGroup
      valueSelected={valueSelected}
      name={name}
      className={`${className} RadioComp`}
      onChange={handleChange}
      defaultSelected={defaultValue}
      style={style}
    >
      {renderRadioButtons()}
    </RadioButtonGroup>
  );
};

export default RadioButtonUi;
