import React from "react";
import { ArrowLeft } from "./svgindex";
import { withRouter } from "react-router-dom";
const BackButton = ({ history, style }) => {
  return (
    <div className="back-btn2" style={style ? style : {}} onClick={() => history.goBack()}>
      <ArrowLeft />
      <p>Back</p>
    </div>
  );
};
export default withRouter(BackButton);
