import React from "react";
import PropTypes from "prop-types";

const ToggleSwitch = ({ value, onChange, label, name, ref, style, ...props }) => {
  return (
    <div style={style}>
      <input
        checked={value}
        onChange={onChange}
        className="react-switch-checkbox"
        id={name}
        type="checkbox"
      />
      <label
        style={{ background: value && '#fcefe7' }}
        className="react-switch-label"
        htmlFor={name}
      >
        <span className={`react-switch-button`} style={{ background: !value && '#bbb' }} />
      </label>
    </div>
  );

};

ToggleSwitch.propTypes = {
  value: PropTypes.bool, 
  name: PropTypes.string,
  onChange: PropTypes.func,
  ref: PropTypes.func,
};

ToggleSwitch.defaultProps = {};

export default ToggleSwitch;
