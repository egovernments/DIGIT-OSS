import React from "react";
import { CheckSvg } from "./svgindex";
import PropTypes from "prop-types";

const CheckBox = ({ onChange, label, ref, checked, inputRef, ...props }) => {
  const userType = Digit.SessionStorage.get("userType");
  // console.log("%c 🏎️: checkbox ", "font-size:16px;background-color:#c239cc;color:white;", props);
  return (
    <div className="checkbox-wrap">
      <div>
        <input
          type="checkbox"
          className={userType === "employee" ? "input-emp" : ""}
          onChange={onChange}
          style={{ cursor: "pointer" }}
          value={label}
          {...props}
          ref={inputRef}
          // {(checked ? (checked = { checked }) : null)}
          checked={checked}
        />
        <p className={userType === "employee" ? "custom-checkbox-emp" : "custom-checkbox"}>
          {/* <img src={check} alt="" /> */}
          <CheckSvg />
        </p>
      </div>
      <p className="label">{label}</p>
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
