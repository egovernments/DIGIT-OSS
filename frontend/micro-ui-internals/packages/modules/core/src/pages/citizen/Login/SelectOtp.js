import React, { useState } from "react";
import { ButtonSelector, CardText, FormStep, LinkButton, OTPInput, CardLabelError } from "@egovernments/digit-ui-react-components";
import useInterval from "../../../hooks/useInterval";

const SelectOtp = ({ config, otp, onOtpChange, onResend, onSelect, t, error }) => {
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
    <FormStep onSelect={onSelect} config={config} t={t} isDisabled={otp?.length !== 6}>
      <OTPInput length={6} onChange={onOtpChange} value={otp} />
      {timeLeft > 0 ? (
        <CardText>{`${t("CS_RESEND_ANOTHER_OTP")} ${timeLeft} ${t("CS_RESEND_SECONDS")}`}</CardText>
      ) : (
        <p className="card-text-button" onClick={handleResendOtp}>
          {t("CS_RESEND_OTP")}
        </p>
      )}
      {!error && <CardLabelError>{t("CS_INVALID_OTP")}</CardLabelError>}
    </FormStep>
  );
};

export default SelectOtp;
