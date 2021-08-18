import React from "react";
import RadioButtons from "../atoms/RadioButtons";
import Dropdown from "../atoms/Dropdown";

const RadioOrSelect = ({
  options,
  onSelect,
  optionKey,
  selectedOption,
  isMandatory,
  t,
  dropdownStyle = {},
  isDependent = false,
  disabled = false,
}) => {
  return (
    <React.Fragment>
      {options?.length < 5 ? (
        <RadioButtons
          selectedOption={selectedOption}
          options={options}
          optionsKey={optionKey}
          isDependent={isDependent}
          disabled={disabled}
          onSelect={onSelect}
          t={t}
        />
      ) : (
        <Dropdown
          isMandatory={isMandatory}
          selected={selectedOption}
          style={dropdownStyle}
          optionKey={optionKey}
          option={options}
          select={onSelect}
          t={t}
          disable={disabled}
        />
      )}
    </React.Fragment>
  );
};

export default RadioOrSelect;
