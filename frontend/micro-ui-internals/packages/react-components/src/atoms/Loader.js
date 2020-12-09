import React from "react";
import PropTypes from "prop-types";

export const Loader = ({ page = false }) => (
  <div className={`${page ? "page" : "module"}-loader`}>
    <div className="loadingio-spinner-rolling-faewnb8ux8">
      <div className="ldio-pjg92h09b2o">
        <div></div>
      </div>
    </div>
  </div>
);

Loader.propTypes = {
  /**
   * Is this is page or a module?
   */
  page: PropTypes.bool,
};

Loader.defaultProps = {
  page: false,
};
