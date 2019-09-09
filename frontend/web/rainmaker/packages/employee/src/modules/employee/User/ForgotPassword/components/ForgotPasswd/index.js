import React from "react";
import { Button, Card, TextField, Image } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import logo from "egov-ui-kit/assets/images/mseva-punjab.png";
import "./index.css";
import { CityPicker } from "modules/common";

const ForgotPasswd = ({ form, handleFieldChange }) => {
  const fields = form.fields || {};
  const submit = form.submit;

  return (
    <Card
      className="user-screens-card forgot-passwd-card col-lg-offset-4 col-lg-4 col-md-offset-4 col-md-4"
      textChildren={
        <div>
          <div className="web-user-logo" style={{ marginBottom: "24px" }}>
            <Image className="mseva-logo employee-login-logo" source={`${logo}`} />
          </div>
          <Label
            style={{ marginBottom: "12px" }}
            className="text-center forgotpasswd"
            bold={true}
            dark={true}
            fontSize={16}
            label="CORE_COMMON_FORGOT_PASSWORD_LABEL"
          />
          <TextField
            onChange={(e, value) => handleFieldChange("username", value)}
            textFieldStyle={{ bottom: 16 }}
            prefixStyle={{ top: 21 }}
            {...fields.username}
          />
          <CityPicker onChange={handleFieldChange} fieldKey="tenantId" field={fields.tenantId} />

          <Button id="login-submit-action" primary={true} label="CONTINUE" fullWidth={true} {...submit} />
        </div>
      }
    />
  );
};

export default ForgotPasswd;
