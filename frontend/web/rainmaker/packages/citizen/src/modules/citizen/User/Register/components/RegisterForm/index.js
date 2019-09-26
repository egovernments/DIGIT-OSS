import React from "react";
import { Link } from "react-router-dom";
import Field from "egov-ui-kit/utils/field";
import { Button, Card, Image } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import { CityPicker } from "modules/common";
import { startSMSRecevier } from "egov-ui-kit/utils/commons";
import logo from "egov-ui-kit/assets/images/logo_black.png";
import "./index.css";
import { type } from "os";

const RegisterForm = ({ handleFieldChange, form,logoUrl }) => {
  const fields = form.fields || {};
  const submit = form.submit;
  return (
    <Card
      className="col-sm-offset-4 col-sm-4 user-screens-card "
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
          <Label className="heading text-center" bold={true} dark={true} fontSize={16} label="CORE_REGISTER_HEADING" />
          <Field fieldKey="phone" field={fields.phone} handleFieldChange={handleFieldChange} />
          <Field fieldKey="name" field={fields.name} handleFieldChange={handleFieldChange} />
          <CityPicker onChange={handleFieldChange} fieldKey="city" field={fields.city} />
          <div style={{ marginBottom: "24px", position: "relative", zIndex: 10 }} className="text-right">
            <Label id="otp-trigger" className="otp-prompt" label="CORE_REGISTER_HAVE_ACCOUNT" />
            <Link to="/user/login">
              <div style={{ display: "inline-block" }}>
                <Label containerStyle={{ cursor: "pointer" }} id="otp-resend" className="otp-resend" label="CORE_COMMON_LOGIN" />
              </div>
            </Link>
          </div>
          <Button
            primary={true}
            fullWidth={true}
            {...submit}
            onClick={(e) => {
              startSMSRecevier();
            }}
          />
        </div>
      }
    />
  );
};

export default RegisterForm;
