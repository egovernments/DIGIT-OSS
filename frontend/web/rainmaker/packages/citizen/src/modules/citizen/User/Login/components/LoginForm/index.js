import React from "react";
import Field from "egov-ui-kit/utils/field";
import { Link } from "react-router-dom";
import { Button, Card, Image ,Icon} from "components";
import Label from "egov-ui-kit/utils/translationNode";
import { startSMSRecevier } from "egov-ui-kit/utils/commons";
import Hidden from "@material-ui/core/Hidden";
import logo from "egov-ui-kit/assets/images/logo_black.png";
import qrlogo from "egov-ui-kit/assets/images/qrImage.png";
import "./index.css";

const LoginForm = ({ handleFieldChange, form, logoUrl,qrCodeURL,enableWhatsApp }) => {
  const fields = form.fields || {};
  const submit = form.submit;

  return (
    <div className="rainmaker-displayInline">
    <Card
      className={enableWhatsApp?"login-cardwidth user-screens-card":"login-cardwidthmob col-sm-offset-4 col-sm-4 user-screens-card"}
      textChildren={
        <div>
          <div className="web-user-logo" style={{ marginBottom: "24px" }}>
            <Image className="mseva-logo employee-login-logo" source={logoUrl?logoUrl:`${logo}`} />
          </div>
          <Label style={{ marginBottom: "12px" }} className="text-center" bold={true} dark={true} fontSize={16} label="CORE_COMMON_LOGIN" />
          <Field fieldKey="phone" field={fields.phone} handleFieldChange={handleFieldChange}  />
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
          {enableWhatsApp&&
           <Hidden mdUp>
          <div>
        <div className="login-hl-divider">
       <div className ="login-circle-mobile">
       <Label  color="black" fontSize= "16px" label="Or"/>
       </div>
    </div>
    <div className="rainmaker-displayInline login-mobile-whatsapp-button"  onClick={()=>{window.location.href="https://api.whatsapp.com/send?phone=918744960111&text=mseva"}} >      
        <Icon action="custom" name="whatsapp" className="login-mobile-whatsapp-icon" />
        <Label bold={true} color="black" fontSize= "14px" label="WHATSAPP_CONTINUE_MOBILE"/>
    </div>
    </div>
      </Hidden>
      }
        </div>
      }
    />
    {enableWhatsApp&&
      <Hidden smDown>
     <div className="login-vl-divider">
       <div className ="login-circle-web">
       <Label  color="black" fontSize= "16px" label="OR"/>
       </div>
    </div>
    <div className="login-qrscan">
       <Image className="login-qrlogo" source={`${qrCodeURL}`} /> 
       <div  className="login-qrtext">
       <Label  color="black" fontSize= "14px" label="WHATSAPP_SCAN_QR_CODE"/>
       </div>
    </div>
    </Hidden>
}
    </div>

  );
};

export default LoginForm;
