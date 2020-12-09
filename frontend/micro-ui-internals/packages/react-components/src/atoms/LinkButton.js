import React from "react";
import PropTypes from "prop-types";

const LinkButton = (props) => {
  return (
    <span className="card-link" onClick={props.onClick}>
      {props.label}
    </span>
  );
};

LinkButton.propTypes = {
  /**
   * LinkButton contents
   */
  label: PropTypes.string.isRequired,
  /**
   * Optional click handler
   */
  onClick: PropTypes.func,
};

LinkButton.defaultProps = {
  label: "Link",
  onClick: undefined,
};

export default LinkButton;
