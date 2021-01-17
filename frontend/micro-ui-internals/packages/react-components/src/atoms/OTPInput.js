import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

const SingleInput = ({ isFocus, onChange, onFocus, value }) => {
  const inputRef = useRef();
  useEffect(() => {
    if (isFocus) {
      inputRef.current.focus();
    }
  }, [isFocus]);

  return <input className="input-otp" maxLength={1} onChange={onChange} onFocus={onFocus} ref={inputRef} type="number" value={value ? value : ""} />;
};

const OTPInput = (props) => {
  const [activeInput, setActiveInput] = useState(0);
  if (!props.length) {
    console.warn("OTPInput Component requires length prop");
  }

  const isInputValueValid = (value) => {
    return typeof value === "string" && value.trim().length === 1;
  };

  const focusNextInput = () => {
    setActiveInput((activeInput) => Math.min(activeInput + 1, props.length - 1));
  };

  const getOtpValue = () => (props.value ? props.value.toString().split("") : []);

  function inputChange(event) {
    const { value } = event.target;
    const { onChange } = props;
    const otp = getOtpValue();
    otp[activeInput] = value[0];
    const otpValue = otp.join("");
    onChange(otpValue);
    if (isInputValueValid(value)) {
      focusNextInput();
    }
  }

  const OTPStack = [];
  const otp = getOtpValue();
  for (let i = 0; i < props.length; i++) {
    // OTPStack.push(<input key={i} type="number" maxLength="1" onChange={props.onInput} className="input-otp" />);
    OTPStack.push(<SingleInput key={i} isFocus={activeInput === i} onChange={inputChange} onFocus={(e) => setActiveInput(i)} value={otp[i]} />);
  }

  return <div className="input-otp-wrap">{OTPStack}</div>;
};

OTPInput.propTypes = {
  length: PropTypes.number,
};

OTPInput.defaultProps = {
  length: 0,
};

export default OTPInput;
