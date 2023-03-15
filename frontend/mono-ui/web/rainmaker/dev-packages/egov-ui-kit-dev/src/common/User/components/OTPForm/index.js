import React from "react";
import { Button, TextField, Card } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import "./index.css";

const OTP = ({ onOtpChanged, onOtpSubmit, disabled, otp, btnText }) => {
  return (
    <Card
      className="user-screens-card"
      textChildren={
        <div>
          <Label className="otp-heading text-center" bold={true} dark={true} fontSize={16} label="ENTER OTP" />
          <Label className="otp-text" label="An OTP has been sent to Mobile Number 9968739374" />

          <form>
            <TextField
              onChange={onOtpChanged}
              id="otp"
              disabled={disabled}
              value={otp}
              fullWidth={true}
              hintText={<Label label="CORE_OTP_HEADING" />}
              floatingLabelText={<Label label="CORE_OTP_OTP" />}
            />
            <div style={{ marginBottom: "24px" }} className="text-right">
              <Label id="otp-trigger" className="otp-prompt" label="Didn't recieve OTP?" />
              <Label id="otp-resend" className="otp-resend" label="RESEND" />
            </div>
            <Button id="otp-start" onClick={onOtpSubmit} primary={true} label={btnText} fullWidth={true} />
          </form>
        </div>
      }
    />
  );
};

export default OTP;
