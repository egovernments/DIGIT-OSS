import React from "react";
import { RadioButton, RadioButtonGroup } from "material-ui/RadioButton";

const RadioButtonUi = ({
  options,
  name,
  defaultValue,
  handleChange,
  style = {}
}) => {
  const renderRadioButtons = () => {
    return options.map((option, index) => {
      return (
        <RadioButton
          key={index}
          value={option.value}
          label={option.label}
          style={style}
        />
      );
    });
  };

  return (
    <RadioButtonGroup
      name={name}
      onChange={handleChange}
      defaultSelected={defaultValue}
    >
      {renderRadioButtons()}
    </RadioButtonGroup>
  );
};

export default RadioButtonUi;
