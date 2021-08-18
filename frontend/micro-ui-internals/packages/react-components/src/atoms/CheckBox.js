import React from "react";
import { CheckSvg } from "./svgindex";
import PropTypes from "prop-types";

const CheckBox = ({ onChange, label, value, disable, ref, checked, inputRef, style, ...props }) => {
  const userType = Digit.SessionStorage.get("userType");
  return (
    <div className="checkbox-wrap">
      <div>
        <input
          type="checkbox"
          className={userType === "employee" ? "input-emp" : ""}
          onChange={onChange}
          style={{ cursor: "pointer" }}
          value={value || label}
          {...props}
          ref={inputRef}
          disabled={disable}
          // {(checked ? (checked = { checked }) : null)}
          checked={checked}
        />
        <p className={userType === "employee" ? "custom-checkbox-emp" : "custom-checkbox"} style={disable ? { opacity: 0.5 } : null}>
          {/* <img src={check} alt="" /> */}
          <CheckSvg />
        </p>
      </div>
      <p className="label" style={style ? style : null}>
        {label}
      </p>
    </div>
  );
};

CheckBox.propTypes = {
  /**
   * CheckBox content
   */
  label: PropTypes.string.isRequired,
  /**
   * onChange func
   */
  onChange: PropTypes.func,
  /**
   * input ref
   */
  ref: PropTypes.func,
  userType: PropTypes.string,
};

CheckBox.defaultProps = {};

export default CheckBox;
