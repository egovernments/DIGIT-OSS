import React from "react";
import { Button, Card, TextField } from "components";
import Label from "utils/translationNode";
import "./index.css";

const ForgotPasswd = ({ form, handleFieldChange }) => {
  const fields = form.fields || {};
  const submit = form.submit;

  return (
    <Card
      className="user-screens-card forgot-passwd-card"
      textChildren={
        <div>
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
          <Button id="login-submit-action" primary={true} label="CONTINUE" fullWidth={true} {...submit} />
        </div>
      }
    />
  );
};

export default ForgotPasswd;
