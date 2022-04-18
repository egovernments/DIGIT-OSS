import React from "react";
import PropTypes from "prop-types";

const AssetLoader = (props) => {
  return (
    <span style={props.wrapper.style} className={props.wrapper.className}>
      <img src={""} alt=""></img>
      {props.children && props.children}
      {props.info && <p>{props.info}</p>}
    </span>
  );
};

AssetLoader.propTypes = {
  /**
   * Is banner is successful or error?
   */
  successful: PropTypes.bool.isRequired,
  /**
   * Banner message
   */
  message: PropTypes.any.isRequired,
  /**
   * If banner is successful, then show the complaint number
   */
  complaintNumber: PropTypes.any,
};

AssetLoader.defaultProps = {
  successful: true,
};

export default AssetLoader;
