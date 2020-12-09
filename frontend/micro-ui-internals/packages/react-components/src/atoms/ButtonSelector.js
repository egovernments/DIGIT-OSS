import React from "react";
import PropTypes from "prop-types";

const ButtonSelector = (props) => {
  let theme = "selector-button-primary";
  switch (props.theme) {
    case "border":
      theme = "selector-button-border";
      break;
    default:
      theme = "selector-button-primary";
      break;
  }
  return (
    <button className={theme} type="submit" onClick={props.onSubmit}>
      <h2>{props.label}</h2>
    </button>
  );
};

ButtonSelector.propTypes = {
  /**
   * ButtonSelector content
   */
  label: PropTypes.string.isRequired,
  /**
   * button border theme
   */
  theme: PropTypes.string,
  /**
   * click handler
   */
  onSubmit: PropTypes.func,
};

ButtonSelector.defaultProps = {
  label: "Submit",
  theme: "default",
  onSubmit: () => alert("You clicked me"),
};

export default ButtonSelector;
