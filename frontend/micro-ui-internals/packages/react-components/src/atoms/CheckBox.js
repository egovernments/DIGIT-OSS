import React from "react";
import { CheckSvg } from "./svgindex";
import PropTypes from "prop-types";

const CheckBox = ({ onChange, label, ref, checked, inputRef, ...props }) => {
  const usertype = Digit.SessionStorage.get("usertype");
  return (
    <div className="checkbox-wrap">
      <input
        type="checkbox"
        className={usertype === "employee" ? "input-emp" : ""}
        onChange={onChange}
        value={label}
        {...props}
        ref={inputRef}
        {...(checked ? (checked = { checked }) : null)}
      />
      <p className="" className={usertype === "employee" ? "custom-checkbox-emp" : "custom-checkbox"}>
        {/* <img src={check} alt="" /> */}
        <CheckSvg />
      </p>
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
  usertype: PropTypes.string,
};

CheckBox.defaultProps = {
  label: "",
  onChange: () => {},
  ref: () => {},
  usertype: "citizen",
};

export default CheckBox;
