import React from "react";
import PropTypes from "prop-types";

const DescriptionText = (props) => {
  return (
    <div className="description-wrap">
      <p>{props.text}</p>
    </div>
  );
};

DescriptionText.propTypes = {
  /**
   * DescriptionText contents
   */
  date: PropTypes.string,
};

DescriptionText.defaultProps = {
  text: "",
};

export default DescriptionText;
