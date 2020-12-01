import React from "react";

const SubmitBar = (props) => {
  return (
    <button className="submit-bar" type={props.submit ? "submit" : "button"} style={{ ...props.style }} onClick={props.onSubmit}>
      <header>{props.label}</header>
    </button>
  );
};

export default SubmitBar;
