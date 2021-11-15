import React from "react";
import PropTypes from "prop-types";
import { RoundedCheck, DeleteBtn } from "./svgindex";

const Toast = (props) => {
  if (props.error) {
    return (
      <div className="toast-success" style={{ backgroundColor: "red", ...props.style }}>
        <RoundedCheck />
        <h2>{props.label}</h2>
        { props.isDleteBtn ? <DeleteBtn fill="none" className="toast-close-btn" onClick={props.onClose} /> : null }
      </div>
    );
  }

  if (props.warning) {
    return (
      <div className="toast-success" style={{ backgroundColor: "#EA8A3B", ...props.style }}>
        <RoundedCheck />
        <h2>{props.label}</h2>
        { props.isDleteBtn ? <DeleteBtn fill="none" className="toast-close-btn" onClick={props.onClose} /> : null }
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
  isDleteBtn: PropTypes.string
};

Toast.defaultProps = {
  label: "",
  onClose: undefined,
  isDleteBtn: ""
};

export default Toast;
