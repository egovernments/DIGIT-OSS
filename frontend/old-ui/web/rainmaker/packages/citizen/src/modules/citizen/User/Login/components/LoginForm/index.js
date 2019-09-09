import React from "react";
import Field from "egov-ui-kit/utils/field";
import { Link } from "react-router-dom";
import { Button, Card, Image } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import { startSMSRecevier } from "egov-ui-kit/utils/commons";
import logo from "egov-ui-kit/assets/images/mseva-punjab.png";
import "./index.css";

const LoginForm = ({ handleFieldChange, form, logoUrl }) => {
  const fields = form.fields || {};
  const submit = form.submit;

  return (
    <Card
      className="user-screens-card language-selection-card col-sm-offset-4 col-sm-4"
      textChildren={
        <div>
          <div className="web-user-logo" style={{ marginBottom: "24px" }}>
            <Image className="mseva-logo employee-login-logo" source={logoUrl?logoUrl:`${logo}`} />
          </div>
          <Label style={{ marginBottom: "12px" }} className="text-center" bold={true} dark={true} fontSize={16} label="CORE_COMMON_LOGIN" />
          <Field fieldKey="phone" field={fields.phone} handleFieldChange={handleFieldChange} />
          <div style={{ marginBottom: "24px", position: "relative", zIndex: 10 }} className="text-right">
            <Label id="otp-trigger" className="otp-prompt" label="CORE_LOGIN_NO_ACCOUNT" />
            <Link to="/user/register">
              <div style={{ display: "inline-block" }}>
                <Label containerStyle={{ cursor: "pointer" }} id="otp-resend" className="otp-resend" label="CORE_REGISTER_HEADING" />
              </div>
            </Link>
          </div>
          <Button
            {...submit}
            fullWidth={true}
            primary={true}
            onClick={(e) => {
              startSMSRecevier();
            }}
          />
        </div>
      }
    />
  );
};

export default LoginForm;
