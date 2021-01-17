import React, { useState } from "react";
import { ButtonSelector, CardText, FormStep, LinkButton, OTPInput } from "@egovernments/digit-ui-react-components";
import useInterval from "../../../hooks/useInterval";

const SelectOtp = ({ config, otp, onOtpChange, onResend, onSelect, t }) => {
  const [timeLeft, setTimeLeft] = useState(30);

  useInterval(
    () => {
      setTimeLeft(timeLeft - 1);
    },
    timeLeft > 0 ? 1000 : null
  );

  const handleResendOtp = () => {
    onResend();
    setTimeLeft(2);
  };

  return (
    <FormStep onSelect={onSelect} config={config} t={t}>
      <OTPInput length={6} onChange={onOtpChange} value={otp} />
      {timeLeft > 0 ? (
        <CardText>Resend another otp in {timeLeft}</CardText>
      ) : (
        <p className="card-text-button" onClick={handleResendOtp}>
          Resend OTP
        </p>
      )}
    </FormStep>
  );
};

export default SelectOtp;
