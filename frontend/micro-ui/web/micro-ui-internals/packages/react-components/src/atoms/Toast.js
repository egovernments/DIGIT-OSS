import React from "react";
import PropTypes from "prop-types";
import { RoundedCheck, DeleteBtn } from "./svgindex";

const Toast = (props) => {
  if (props.error) {
    return (
      <div className="toast-success" style={{ backgroundColor: "red", ...props.style }}>
        <RoundedCheck />
        <h2>{props.label}</h2>
        {/* <DeleteBtn fill="none" className="toast-close-btn" onClick={props.onClose} /> */}
      </div>
    );
  }

  return (
    <div className="toast-success" style={{ ...props.style }}>
      <RoundedCheck />
      <h2>{props.label}</h2>
      <DeleteBtn fill="none" className="toast-close-btn" onClick={props.onClose} />
    </div>
  );
};

Toast.propTypes = {
  label: PropTypes.string,
  onClose: PropTypes.func,
};

Toast.defaultProps = {
  label: "",
  onClose: undefined,
};

export default Toast;
