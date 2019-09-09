import React from "react";
import PropTypes from "prop-types";
import FloatingActionButton from "material-ui/FloatingActionButton";

//button component
const FloatingButton = ({ label = "Continue", jsonPath, ...rest }) => {
  return <FloatingActionButton label={label} {...rest} />;
};

FloatingButton.propTypes = {
  onClick: PropTypes.func,
  primary: PropTypes.bool,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  style: PropTypes.object,
};

export default FloatingButton;
