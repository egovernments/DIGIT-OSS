import React from "react";

export const Loader = ({ page = false }) => (
  <div className={`${page ? "page" : "module"}-loader`}>
    <div className="loadingio-spinner-rolling-faewnb8ux8">
      <div className="ldio-pjg92h09b2o">
        <div></div>
      </div>
    </div>
  </div>
);
