import React from "react";
import PropTypes from "prop-types";
import { RoundedCheck, DeleteBtn } from "./svgindex";

const Toast = (props) => {
  return (
    <div className="toast-success">
      <RoundedCheck />
      <h2>{props.label}</h2>
      <DeleteBtn fill="none" className="toast-close-btn" onClick={props.onClose} />
    </div>
  );
};

Toast.propTypes = {
  label: PropTypes.string.isRequired,
  onClose: PropTypes.func,
};

Toast.defaultProps = {
  label: "",
  onClose: undefined,
};

export default Toast;
