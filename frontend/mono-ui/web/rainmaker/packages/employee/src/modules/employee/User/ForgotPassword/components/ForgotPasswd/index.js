import React from "react";
import { Card, TextField, Image } from "components";
import { Button} from "egov-ui-framework/ui-atoms";
import Label from "egov-ui-kit/utils/translationNode";
import logo from "egov-ui-kit/assets/images/logo_black.png";
import "./index.css";
import { CityPicker } from "modules/common";

const ForgotPasswd = ({ form, handleFieldChange,logoUrl }) => {
  const fields = form.fields || {};
  const submit = form.submit;

  return (
    <Card
      className="user-screens-card forgot-passwd-card col-lg-offset-4 col-lg-4 col-md-offset-4 col-md-4"
      textChildren={
        <div>
          <div className="rainmaker-displayInline" style={{ justifyContent: "center" ,alignItems:"center",marginBottom: "24px"}}>
            <div style={{ }}>
              <Image className="mseva-logo" source={logoUrl?logoUrl:`${logo}`} />
            </div >
          <div style={{marginLeft:"7px" }}>
          <Label bold={true}  fontSize= "23px" label="|" />
          </div>
           <div style={{marginLeft:"7px" }}>
              <Label bold={true} color="black" fontSize= "24px" label="STATE_LABEL" />
           </div>
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
          <Button
           id="login-submit-action"
                {...submit}
            style={{
              height: "48px",     
              width:"100%"        
            }}
            variant={"contained"}
            color={"primary"}
          >
            <Label buttonLabel={true}   labelStyle={{fontWeight:500 }}  label="CORE_COMMON_CONTINUE" />
          </Button>
          {/* <Button id="login-submit-action" primary={true} label="CONTINUE" fullWidth={true} {...submit} /> */}
        </div>
      }
    />
  );
};

export default ForgotPasswd;
