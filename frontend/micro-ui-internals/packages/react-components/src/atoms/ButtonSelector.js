import React from "react";

const ButtonSelector = (props) => {
  let theme = "selector-button-primary";
  switch (props.theme) {
    case "border":
      theme = "selector-button-border";
      break;
    default:
      theme = "selector-button-primary";
      break;
  }
  return (
    <button className={theme} type="submit" onClick={props.onSubmit}>
      <h2>{props.label}</h2>
    </button>
  );
};

export default ButtonSelector;
