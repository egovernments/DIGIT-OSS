import React from "react";
import PropTypes from "prop-types";
import RaisedButton from "material-ui/RaisedButton";
//button component
const Button = ({ label = "Continue", jsonPath, ...rest }) => {
  return <RaisedButton label={label} {...rest} />;
};

Button.propTypes = {
  onClick: PropTypes.func,
  primary: PropTypes.bool,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  style: PropTypes.object,
};

export default Button;
