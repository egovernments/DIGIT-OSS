import React from "react";

const SubmitBar = (props) => {
  console.log("props:", props);
  return (
    <button
      className={props.disabled ? "submit-bar-disabled" : "submit-bar"}
      type={props.submit ? "submit" : "button"}
      style={{ ...props.style }}
      onClick={props.disabled ? null : props.onSubmit}
    >
      <header>{props.label}</header>
    </button>
  );
};

export default SubmitBar;
