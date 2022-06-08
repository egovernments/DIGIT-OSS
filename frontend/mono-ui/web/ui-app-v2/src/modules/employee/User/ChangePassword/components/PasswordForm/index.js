import React from "react";
import { Button, TextField } from "components";
import "./index.css";

const PasswordForm = ({ handleFieldChange, toggleSnackbarAndSetText, form }) => {
  const fields = form.fields || {};
  const submit = form.submit;
  const { newpassword, confirmnewpassword } = fields;

  return (
    <div className="employee-change-password">
      <TextField
        className="emp-change-passwd-field"
        onChange={(e, value) => handleFieldChange("existingPassword", value)}
        {...fields.existingPassword}
      />
      <TextField className="emp-change-passwd-field" onChange={(e, value) => handleFieldChange("newpassword", value)} {...fields.newpassword} />
      <TextField
        className="emp-change-passwd-field"
        onChange={(e, value) => handleFieldChange("confirmnewpassword", value)}
        {...fields.confirmnewpassword}
      />

      <Button
        {...submit}
        className="employee-change-passwd-submit btn-without-bottom-nav col-lg-offset-2 col-md-offset-2"
        fullWidth={true}
        primary={true}
        onClick={(e) => {
          if (newpassword.value !== confirmnewpassword.value) {
            e.preventDefault();
            toggleSnackbarAndSetText(true, "Password do not match", true);
          }
        }}
      />
    </div>
  );
};

export default PasswordForm;
