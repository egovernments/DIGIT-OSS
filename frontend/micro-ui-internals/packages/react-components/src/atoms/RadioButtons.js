import React, { useEffect } from "react";
import PropTypes from "prop-types";
import isEqual from "lodash/isEqual";
import { useTranslation } from "react-i18next";

const RadioButtons = (props) => {
  const { t } = useTranslation();
  var selected = props.selectedOption;
  function selectOption(value) {
    selected = value;
    props.onSelect(value);
  }

  return (
    <div style={props.style} className="radio-wrap">
      {props?.options?.map((option, ind) => {
        if (props?.optionsKey && !props?.isDependent) {
          return (
            <div style={props.innerStyles} key={ind}>
              <span className="radio-btn-wrap">
                <input
                  className="radio-btn"
                  type="radio"
                  value={option}
                  checked={isEqual(selected, option) ? 1 : 0}
                  onChange={() => selectOption(option)}
                  disabled={props?.disabled}
                />
                <span className="radio-btn-checkmark"></span>
              </span>
              <label>{t(option[props.optionsKey])}</label>
            </div>
          );
        } else if (props?.optionsKey && props?.isDependent) {
          return (
            <div key={ind}>
              <span className="radio-btn-wrap">
                <input
                  className="radio-btn"
                  type="radio"
                  value={option}
                  checked={selected?.code === option.code ? 1 : 0}
                  onChange={() => selectOption(option)}
                  disabled={props?.disabled}
                />
                <span className="radio-btn-checkmark"></span>
              </span>
              <label>{t(props.labelKey ? `${props.labelKey}_${option.code}` : option.code)}</label>
            </div>
          );
        } else {
          return (
            <div key={ind}>
              <span className="radio-btn-wrap">
                <input
                  className="radio-btn"
                  type="radio"
                  value={option}
                  checked={selected === option ? 1 : 0}
                  onChange={() => selectOption(option)}
                  disabled={props?.disabled}
                />
                <span className="radio-btn-checkmark"></span>
              </span>
              <label>{t(option)}</label>
            </div>
          );
        }
      })}
    </div>
  );
};

RadioButtons.propTypes = {
  selectedOption: PropTypes.any,
  onSelect: PropTypes.func,
  options: PropTypes.any,
  optionsKey: PropTypes.string,
  innerStyles: PropTypes.any,
  style: PropTypes.any,
};

RadioButtons.defaultProps = {};

export default RadioButtons;
