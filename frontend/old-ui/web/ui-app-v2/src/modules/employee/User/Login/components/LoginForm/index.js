import React from "react";
import { Link } from "react-router-dom";
import { Button, Card, TextField } from "components";
import Label from "utils/translationNode";
import "./index.css";

const LoginForm = ({ handleFieldChange, form, onForgotPasswdCLick }) => {
  const fields = form.fields || {};
  const submit = form.submit;
  return (
    <Card
      className="user-screens-card"
      textChildren={
        <div>
          <Label style={{ marginBottom: "12px" }} className="text-center" bold={true} dark={true} fontSize={16} label="LOGIN" />
          <TextField onChange={(e, value) => handleFieldChange("username", value)} {...fields.username} />
          <TextField onChange={(e, value) => handleFieldChange("password", value)} {...fields.password} />
          <Link to="/employee/user/forgot-password">
            <div style={{ float: "right" }}>
              <Label
                containerStyle={{ cursor: "pointer" }}
                labelStyle={{ marginBottom: "12px" }}
                className="forgot-passwd"
                fontSize={14}
                label="FORGOT PASSWORD?"
              />
            </div>
          </Link>
          <Button {...submit} fullWidth={true} primary={true} />
        </div>
      }
    />
  );
};

export default LoginForm;
