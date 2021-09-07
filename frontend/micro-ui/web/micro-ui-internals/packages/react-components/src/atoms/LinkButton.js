import React from "react";
import PropTypes from "prop-types";

const LinkButton = (props) => {
  return (
    <span className={`card-link cp ${props.className}`} onClick={props.onClick} style={props.style}>
      {props.label}
    </span>
  );
};

LinkButton.propTypes = {
  /**
   * LinkButton contents
   */
  label: PropTypes.any,
  /**
   * Optional click handler
   */
  onClick: PropTypes.func,
};

LinkButton.defaultProps = {};

export default LinkButton;
