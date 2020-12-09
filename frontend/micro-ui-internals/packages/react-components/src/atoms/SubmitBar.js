import React from "react";
import PropTypes from "prop-types";

const SubmitBar = (props) => {
  return (
    <button className="submit-bar" type={props.submit ? "submit" : "button"} style={{ ...props.style }} onClick={props.onSubmit}>
      <header>{props.label}</header>
    </button>
  );
};

SubmitBar.propTypes = {
  /**
   * Is it a normal button or submit button?
   */
  submit: PropTypes.bool,
  /**
   * style for the button
   */
  style: PropTypes.object,
  /**
   * SubmitButton contents
   */
  label: PropTypes.string.isRequired,
  /**
   * Optional click handler
   */
  onSubmit: PropTypes.func,
};

SubmitBar.defaultProps = {
  submit: false,
  style: {},
  label: "Click me",
  onSubmit: undefined,
};

export default SubmitBar;
