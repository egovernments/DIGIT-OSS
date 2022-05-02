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
  labelKey,
  dropdownStyle = {},
  isDependent = false,
  disabled = false,
  optionCardStyles,
  isPTFlow=false,
  isDropDown = false,
  innerStyles = {},
  inputStyle = {}
}) => {
  return (
    <React.Fragment>
      {options?.length < 5 && !isDropDown ? (
        <RadioButtons
          selectedOption={selectedOption}
          options={options}
          optionsKey={optionKey}
          isDependent={isDependent}
          disabled={disabled}
          onSelect={onSelect}
          labelKey={labelKey}
          isPTFlow={isPTFlow}
          t={t}
          innerStyles={innerStyles}
          inputStyle={inputStyle}
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
          optionCardStyles={optionCardStyles}
        />
      )}
    </React.Fragment>
  );
};

export default RadioOrSelect;
