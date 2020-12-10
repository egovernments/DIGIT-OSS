import React from "react";
import PropTypes from "prop-types";
import isEqual from "lodash/isEqual";

const RadioButtons = (props) => {
  var selected = props.selectedOption;
  console.log("selected option", selected);
  function selectOption(value) {
    console.log("value,,,,,", value);
    selected = value;
    props.onSelect(value);
  }
  return (
    <div className="radio-wrap">
      {props.options.map((option) => {
        console.log("%c 🏎️: RadioButtons -> option ", "font-size:16px;background-color:#c239cc;color:white;", option);
        if (props.optionsKey) {
          return (
            <div key={option[props.optionsKey]}>
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
              <label>{option[props.optionsKey]}</label>
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

RadioButtons.propTypes = {
  selectedOption: PropTypes.string.isRequired,
  onSelect: PropTypes.func,
  options: PropTypes.array.isRequired,
  optionKey: PropTypes.string.isRequired,
};

RadioButtons.defaultProps = {
  selectedOption: "first",
  onSelect: undefined,
  options: ["first", "second"],
  optionKey: 0,
};

export default RadioButtons;
