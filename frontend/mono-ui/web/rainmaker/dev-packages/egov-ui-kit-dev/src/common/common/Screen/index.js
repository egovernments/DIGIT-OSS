import React from "react";
import { LoadingIndicator } from "components";

const Screen = ({ children, className = "", loading }) => {
  return (
    <div className={`screen col-xs-12 col-sm-12 col-md-12 col-lg-12  ${className}`}>
      {children}
      {loading && <LoadingIndicator />}
    </div>
  );
};

export default Screen;
