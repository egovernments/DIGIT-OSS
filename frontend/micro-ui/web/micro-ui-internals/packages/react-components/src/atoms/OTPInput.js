import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";

const BACKSPACE = 8;

const SingleInput = ({ isFocus, onChange, onFocus, value, ...rest }) => {
  const inputRef = useRef();
  useEffect(() => {
    if (isFocus) {
      inputRef.current.focus();
    }
  }, [isFocus]);

  return (
    <input
      className="input-otp"
      maxLength={1}
      onChange={onChange}
      onFocus={onFocus}
      ref={inputRef}
      type="number"
      value={value ? value : ""}
      {...rest}
    />
  );
};

const OTPInput = (props) => {
  const [activeInput, setActiveInput] = useState(0);

  const isInputValueValid = (value) => {
    return typeof value === "string" && value.trim().length === 1;
  };

  const changeCodeAtFocus = (value) => {
    const { onChange } = props;
    const otp = getOtpValue();
    otp[activeInput] = value[0];
    const otpValue = otp.join("");
    onChange(otpValue);
  };

  const focusNextInput = () => {
    setActiveInput((activeInput) => Math.min(activeInput + 1, props.length - 1));
  };

  const focusPrevInput = () => {
    setActiveInput((activeInput) => Math.max(activeInput - 1, 0));
  };

  const getOtpValue = () => (props.value ? props.value.toString().split("") : []);

  const handleKeyDown = (event) => {
    if (event.keyCode === BACKSPACE || event.key === "Backspace") {
      event.preventDefault();
      changeCodeAtFocus("");
      focusPrevInput();
    }
  };

  function inputChange(event) {
    const { value } = event.target;
    changeCodeAtFocus(value);
    if (isInputValueValid(value)) {
      focusNextInput();
    }
  }

  const OTPStack = [];
  const otp = getOtpValue();
  for (let i = 0; i < props.length; i++) {
    OTPStack.push(
      <SingleInput
        key={i}
        isFocus={activeInput === i}
        onChange={inputChange}
        onKeyDown={handleKeyDown}
        onFocus={(e) => {
          setActiveInput(i);
          e.target.select();
        }}
        value={otp[i]}
      />
    );
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
