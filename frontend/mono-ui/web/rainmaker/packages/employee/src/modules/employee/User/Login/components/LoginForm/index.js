import React from "react";
import { Link } from "react-router-dom";
import { Button, Card, TextField, Image } from "components";
import { CityPicker } from "modules/common";
import Label from "egov-ui-kit/utils/translationNode";
import logo from "egov-ui-kit/assets/images/logo_black.png";
import "./index.css";

const LoginForm = ({ handleFieldChange, form, onForgotPasswdCLick, logoUrl }) => {
  const fields = form.fields || {};
  const submit = form.submit;
  return (
    <Card
      className="user-screens-card col-lg-offset-4 col-lg-4 col-md-offset-4 col-md-4 col-sm-offset-4 col-sm-4"
      textChildren={
        <div>
          <div className="rainmaker-displayInline" style={{ justifyContent: "center" }}>
            <div style={{ marginBottom: "24px" }}>
              <Image className="mseva-logo" source={`${logo}`} />
            </div >
          <div style={{marginLeft:"7px", marginBottom: "24px" }}>
          <Label bold={true}  fontSize= "23px" label="|" />
          </div>
           <div style={{marginLeft:"7px" }}>
              <Label bold={true} color="black" fontSize= "24px" label="Punjab" />
           </div>
          </div>
          <Label style={{ marginBottom: "12px" }} className="text-center" bold={true} dark={true} fontSize={16} label="CORE_COMMON_LOGIN" />
          <TextField onChange={(e, value) => handleFieldChange("username", value)} {...fields.username} />
          <TextField onChange={(e, value) => handleFieldChange("password", value)} {...fields.password}  />
          <CityPicker onChange={handleFieldChange} fieldKey="city" field={fields.city} />
          <Link to="/forgot-password">
            <div style={{ float: "right" }}>
              <Label
                containerStyle={{ cursor: "pointer", position: "relative", zIndex: 10 }}
                labelStyle={{ marginBottom: "12px" }}
                className="forgot-passwd"
                fontSize={14}
                label="CORE_COMMON_FORGOT_PASSWORD"
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
