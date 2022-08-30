import React, { forwardRef } from "react";
import PropTypes from "prop-types";

const SubmitBar = forwardRef((props, ref) => {
  return (
    <button
      ref={ref}
      disabled={props.disabled ? true : false}
      className={`${props.disabled ? "submit-bar-disabled" : "submit-bar"} ${props.className ? props.className : ""}`}
      type={props.submit ? "submit" : "button"}
      style={{ ...props.style }}
      onClick={props.onSubmit}
      {... props.form ? {form: props.form} : {}}
    >
      <header>{props.label}</header>
    </button>
  );
});

SubmitBar.propTypes = {
  /**
   * Is it a normal button or submit button?
   */
  submit: PropTypes.any,
  /**
   * style for the button
   */
  style: PropTypes.object,
  /**
   * SubmitButton contents
   */
  label: PropTypes.string,
  /**
   * Optional click handler
   */
  onSubmit: PropTypes.func,
};

SubmitBar.defaultProps = {};

export default SubmitBar;
