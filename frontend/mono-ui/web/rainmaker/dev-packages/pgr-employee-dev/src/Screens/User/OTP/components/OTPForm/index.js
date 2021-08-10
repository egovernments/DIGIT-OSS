import React from "react";
import { Button, Card, TextField, Image } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import logo from "egov-ui-kit/assets/images/mseva-punjab.png";
import "./index.css";

const OTPForm = ({
  handleFieldChange,
  toggleSnackbarAndSetText,
  form,
  resendOTP,
  phoneNumber
}) => {
  const fields = form.fields || {};
  const submit = form.submit;
  const { newPassword, confirmnewpassword } = fields || {};

  return (
    <Card
      className="user-screens-card forgot-passwd-card col-lg-offset-4 col-lg-4 col-md-offset-4 col-md-4"
      textChildren={
        <div>
          <div className="web-user-logo" style={{ marginBottom: "24px" }}>
            <Image
              className="mseva-logo employee-login-logo"
              source={`${logo}`}
            />
          </div>
          <Label
            className="text-center"
            bold={true}
            dark={true}
            fontSize={16}
            label="CORE_COMMON_FORGOT_PASSWORD_LABEL"
          />
          <div className="citizen-otp-sent-message" style={{ marginTop: 24 }}>
            <Label label="CORE_OTP_SENT_MESSAGE" />
            <Label label={phoneNumber} />
          </div>
          <Label
            label="CORE_EMPLOYEE_OTP_CHECK_MESSAGE"
            color={"rgba(0, 0, 0, 0.3799999952316284)"}
            fontSize={"12px"}
          />
          <form>
            <TextField
              errorStyle={{ bottom: "0px" }}
              onChange={(e, value) => handleFieldChange("otpReference", value)}
              id="otp"
              {...fields.otpReference}
              fullWidth={true}
              type={"number"}
            />
            <div
              style={{ marginBottom: 0 }}
              className="text-right employee-resend-otp-text"
            >
              <Label
                id="otp-trigger"
                className="otp-prompt"
                label="CORE_OTP_NOT_RECEIVE"
              />
              <span style={{ cursor: "pointer" }} onClick={() => resendOTP()}>
                <Label
                  id="otp-resend"
                  className="otp-resend"
                  label="CORE_OTP_RESEND"
                />
              </span>
            </div>

            <TextField
              onChange={(e, value) => handleFieldChange("newPassword", value)}
              {...fields.newPassword}
            />
            <TextField
              style={{ marginBottom: 24 }}
              onChange={(e, value) =>
                handleFieldChange("confirmnewpassword", value)
              }
              {...fields.confirmnewpassword}
            />

            <Button
              {...submit}
              onClick={e => {
                if (newPassword.value !== confirmnewpassword.value) {
                  e.preventDefault();
                  toggleSnackbarAndSetText(
                    true,
                    {
                      labelName: "Password do not match",
                      labelKey: "ERR_PASSWORD_DO_NOT_MATCH"
                    },
                    "error"
                  );
                }
              }}
              fullWidth={true}
              primary={true}
            />
          </form>
        </div>
      }
    />
  );
};

export default OTPForm;
