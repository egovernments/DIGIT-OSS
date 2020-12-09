import React from "react";
import { CheckSvg } from "./svgindex";
import PropTypes from "prop-types";

const CheckBox = ({ onChange, label, ref, ...props }) => {
  return (
    <div className="checkbox-wrap">
      <input type="checkbox" onChange={onChange} value={label} {...props} ref={ref} />
      <p className="custom-checkbox">
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
};

CheckBox.defaultProps = {
  label: "Agree to terms and conditions",
  onChange: () => {},
  ref: () => {},
};

export default CheckBox;
