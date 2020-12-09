import React from "react";
import PropTypes from "prop-types";

const OTPInput = (props) => {
  if (!props.length) {
    console.warn("OTPInput Component requires length prop");
  }
  var OTPStack = [];
  for (var i = 1; i <= props.length; i++) {
    OTPStack.push(<input key={i} type="number" max="1" onChange={props.onInput} className="input-otp" />);
  }

  return <div className="input-otp-wrap">{OTPStack}</div>;
};

OTPInput.propTypes = {
  length: PropTypes.number.isRequired,
};

OTPInput.defaultProps = {
  length: 4,
};

export default OTPInput;
