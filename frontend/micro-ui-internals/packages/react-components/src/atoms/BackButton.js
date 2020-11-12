import React from "react";
import { ArrowLeft } from "./Icons";
import { withRouter } from "react-router-dom";
const BackButton = (props) => {
  return (
    <div className="back-btn2" onClick={() => props.history.goBack()}>
      <ArrowLeft />
      <p>Back</p>
    </div>
  );
};
export default withRouter(BackButton);
