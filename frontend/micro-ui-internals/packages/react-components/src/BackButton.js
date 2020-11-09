import React from "react";
import { ArrowLeft } from "./Icons";
const BackButton = (props) => {
  return (
    <div className="back-btn2" onClick={props.onClick}>
      <ArrowLeft />
      <p>Back</p>
    </div>
  );
};
export default BackButton;
