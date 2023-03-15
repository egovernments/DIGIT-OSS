import React from "react";
import PropTypes from "prop-types";

const Icon = ({ action, className, name, style = {}, color, onClick, id, ...rest }) => {
  let WrappedIcon = null;
  try {
    if (action === "custom") {
      WrappedIcon = require(`egov-ui-kit/custom-icons/${name}`).default;
    } else {
      WrappedIcon = require(`material-ui/svg-icons/${action}/${name}`).default;
    }
    return <WrappedIcon id={id} className={className} style={{ ...style }} color={color} onClick={onClick} {...rest} />;
  } catch (error) {
    const DefaultIcon = require(`material-ui/svg-icons/alert/error`).default;
    return <DefaultIcon id={id} className={className} style={{ ...style }} color="red" fill="red" onClick={onClick} />;
  }
  // throw new Error(`Icon with action ${action} and name ${name} not found`);
};

Icon.propTypes = {
  className: PropTypes.string,
  action: PropTypes.string,
  name: PropTypes.string,
  color: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
};

export default Icon;
