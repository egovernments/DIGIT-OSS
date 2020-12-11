import React from "react";
import isEqual from "lodash/isEqual";

const RadioButtons = (props) => {
  var selected = props.selectedoption;
  console.log("selected option", selected);
  function selectOption(value) {
    console.log("value,,,,,", value);
    selected = value;
    props.onSelect(value);
  }
  return (
    <div className="radio-wrap">
      {props.options.map((option) => {
        if (props.optionskey) {
          return (
            <div key={option[props.optionskey]}>
              <span className="radio-btn-wrap">
                <input
                  className="radio-btn"
                  type="radio"
                  value={option}
                  checked={isEqual(selected, option) ? 1 : 0}
                  onChange={() => selectOption(option)}
                />
                <span className="radio-btn-checkmark"></span>
              </span>
              <label>{option[props.optionskey]}</label>
            </div>
          );
        } else {
          return (
            <div key={option}>
              <span className="radio-btn-wrap">
                <input
                  className="radio-btn"
                  type="radio"
                  value={option}
                  checked={selected === option ? 1 : 0}
                  onChange={() => selectOption(option)}
                />
                <span className="radio-btn-checkmark"></span>
              </span>
              <label>{option}</label>
            </div>
          );
        }
      })}
    </div>
  );
};

export default RadioButtons;
