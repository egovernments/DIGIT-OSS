import React from "react";
import { Button, TextField } from "components";
import "./index.css";

const PasswordForm = ({ handleFieldChange, toggleSnackbarAndSetText, form }) => {
  const fields = form.fields || {};
  const submit = form.submit;
  const { newpassword, confirmnewpassword } = fields;

  return (
    <div>
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
      </div>
      <div className="responsive-action-button-cont">
        <Button
          {...submit}
          className="responsive-action-button"
          fullWidth={true}
          primary={true}
          onClick={(e) => {
            if (newpassword.value !== confirmnewpassword.value) {
              e.preventDefault();
              toggleSnackbarAndSetText(
                true,
                {
                  labelName: "Password do not match",
                  labelKey: "ERR_PASSWORD_DO_NOT_MATCH",
                },
               "error"
              );
            }
          }}
        />
      </div>
    </div>
  );
};

export default PasswordForm;
