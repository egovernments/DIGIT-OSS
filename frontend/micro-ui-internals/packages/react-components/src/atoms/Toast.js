import React from "react";
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

export default Toast;
