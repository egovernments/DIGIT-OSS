import React from "react";
import Field from "egov-ui-kit/utils/field";
import { Link } from "react-router-dom";
import { Card, Image, Icon } from "components";
import { Button } from "egov-ui-framework/ui-atoms";
import Label from "egov-ui-kit/utils/translationNode";
import { startSMSRecevier } from "egov-ui-kit/utils/commons";
import Hidden from "@material-ui/core/Hidden";
import logo from "egov-ui-kit/assets/images/logo_black.png";
import "./index.css";
import { Select } from "@material-ui/core";
import { TextField } from '@material-ui/core';
import {InputLabel} from '@material-ui/core';
import {MenuItem} from '@material-ui/core';
import {FormControl} from '@material-ui/core';

const LoginForm = ({ handleFieldChange, form, logoUrl, qrCodeURL, enableWhatsApp }) => {
  const fields = form.fields || {};
  const fieldsU = form.fieldsU || {};
  const submit = form.submit;

  const [age, setAge] = React.useState('');
  const [userId, setUserId] = React.useState('');

  const handleChange = (event) => {
    setAge(event.target.value);
    // setUserId(event.target.value);
  };
  const handleOnChange = (event) => {
    // setAge(event.target.value);
    setUserId(event.target.value);
  };

  return (
    <div className="rainmaker-displayInline">
      {!enableWhatsApp &&
        <Card
          className={enableWhatsApp ? "login-cardwidth user-screens-card" : "login-cardwidthmob col-sm-offset-4 col-sm-4 user-screens-card"}
          textChildren={
            <div>
              <div className="rainmaker-displayInline" style={{ justifyContent: "center", alignItems: "center", marginBottom: "24px" }}>
                {/* <div style={{}}>
                  <Image className="mseva-logo" source={`${logo}`} />
                </div > */}
                {/* <div style={{marginLeft:"7px"}}>
                  <Label bold={true}  fontSize= "23px" label="|" />
                  </div>
                  <div style={{marginLeft:"7px" }}>
                      <Label bold={true} color="black" fontSize= "24px" label="STATE_LABEL" />
                  </div> */}
              </div>
              <Label style={{ marginBottom: "12px" }} className="text-center" bold={true} dark={true} fontSize={16} label="CORE_COMMON_LOGIN" />
              <Field fieldKey="phone" field={fields.phone} handleFieldChange={handleFieldChange} />
              <Select>
                  <option>1</option>
                  <option>1</option>
                  <option>1</option>
                  <option>1</option>
                </Select>
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
                style={{
                  height: "48px",
                  width: "100%"
                }}
                variant={"contained"}
                color={"primary"}
                onClick={() => {
                  startSMSRecevier();
                }}
              >
                <Label buttonLabel={true} labelStyle={{ fontWeight: 500 }} label="CORE_COMMON_CONTINUE" />
              </Button>
              {/* <Button
            {...submit}
            fullWidth={true}
            primary={true}
            onClick={(e) => {
              startSMSRecevier();
            }}
          /> */}
              {enableWhatsApp &&
                <Hidden mdUp>
                  <div>
                    <div className="login-hl-divider">
                      <div className="login-circle-mobile">
                        <Label color="black" fontSize="16px" label="Or" />
                      </div>
                    </div>
                    {/* <div className="rainmaker-displayInline login-mobile-whatsapp-button"  onClick={()=>{window.location.href="https://api.whatsapp.com/send?phone=918744960111&text=mSeva-send+this+to+start"}} >      
        <Icon action="custom" name="whatsapp" className="login-mobile-whatsapp-icon" />
        <Label bold={true} color="black" fontSize= "14px" label="WHATSAPP_CONTINUE_MOBILE"/>
    </div> */}
                  </div>
                </Hidden>
              }
            </div>
          }
        />
      }
      {enableWhatsApp &&

        <Hidden mdUp>
          <Card
            className={enableWhatsApp ? "login-cardwidth user-screens-card" : "login-cardwidthmob col-sm-offset-4 col-sm-4 user-screens-card"}
            textChildren={
              <div>
                <div className="rainmaker-displayInline" style={{ justifyContent: "center" }}>
                  <div style={{ marginBottom: "24px" }}>
                    <Image className="mseva-logo" source={`${logo}`} />
                  </div >
                  {/* <div style={{marginLeft:"7px", marginBottom: "24px" }}>
          <Label bold={true}  fontSize= "23px" label="|" />
          </div>
           <div style={{marginLeft:"7px" }}>
              <Label bold={true} color="black" fontSize= "24px" label="STATE_LABEL" />
           </div> */}
                </div>
                <Label style={{ marginBottom: "12px" }} className="text-center" bold={true} dark={true} fontSize={16} label="CORE_COMMON_LOGIN" />
                <Field fieldKey="phone" field={fields.phone} handleFieldChange={handleFieldChange} />
                <Select>
                  <option>1</option>
                  <option>1</option>
                  <option>1</option>
                  <option>1</option>
                </Select>
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
                  style={{
                    height: "48px",
                    width: "100%"
                  }}
                  variant={"contained"}
                  color={"primary"}
                  onClick={() => {
                    startSMSRecevier();
                  }}
                >
                  <Label buttonLabel={true} labelStyle={{ fontWeight: 500 }} label="CORE_COMMON_CONTINUE" />
                </Button>
                {/* <Button
            {...submit}
            fullWidth={true}
            primary={true}
            onClick={(e) => {
              startSMSRecevier();
            }}
          /> */}
                {enableWhatsApp &&
                  <Hidden mdUp>
                    {/* <div>
            <div className="login-hl-divider">
              <div className ="login-circle-mobile">
              <Label  color="black" fontSize= "16px" label="Or"/>
              </div>
            </div>
            <div className="rainmaker-displayInline login-mobile-whatsapp-button"  onClick={()=>{window.location.href="https://api.whatsapp.com/send?phone=918744960111&text=mSeva-send+this+to+start"}} >      
                <Icon action="custom" name="whatsapp" className="login-mobile-whatsapp-icon" />
                <Label bold={true} color="black" fontSize= "14px" label="WHATSAPP_CONTINUE_MOBILE"/>
            </div>
          </div> */}
                  </Hidden>
                }
              </div>
            }
          />
        </Hidden>
      }
      {enableWhatsApp &&
        <Hidden smDown>
          <Card
            className="wha-user-screen-card"
            textChildren={
              <div>
                <div className="rainmaker-displayInline" style={{ justifyContent: "center" }}>
                  {/* <div style={{ marginBottom: "24px" }}>
                    <Image className="mseva-logo" source={`${logo}`} />
                  </div > */}
                  {/* <div style={{marginLeft:"7px", marginBottom: "24px" }}>
            <Label bold={true}  fontSize= "23px" label="|" />
            </div>
            <div style={{marginLeft:"7px" }}>
                <Label bold={true} color="black" fontSize= "24px" label="STATE_LABEL" />
            </div> */}
                </div>
                <div className="rainmaker-displayInline" style={{ justifyContent: "center" }}>
                  <div style={{ width: "80%", marginTop: "4%" }}>
                    <Label style={{ marginBottom: "12px" }} className="text-center" bold={true} dark={true} fontSize={24} label="CORE_COMMON_LOGIN" />
                    <FormControl id="standard-basic" variant="standard" style={{width:"100%"}}>
                        <InputLabel id="select-standard-label">Select User Type</InputLabel>
                        <Select
                          labelId="select-standard-label"
                          id="demo-simple-select-standard"
                          className="w-100"
                          value={age}
                          onChange={handleChange}
                          label="Select User Type"
                        >
                          <MenuItem value="">
                            <em>Select User Type</em>
                          </MenuItem>
                          <MenuItem value={202}>Authorized Applicant</MenuItem>
                          <MenuItem value={201}>Developer</MenuItem>
                        </Select>
                    </FormControl>
                    {/* <div style={{display: "flex", flexWrap:"wrap", justifyContent:"space-between"}}> */}
                      <Field fieldKey="phone" field={fields.phone} handleFieldChange={handleFieldChange} />
                      <FormControl id="standard-basic" variant="standard" style={{width:"100%"}}>
                        <InputLabel id="demo-simple-select-standard-label">Select User ID</InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="user-id-select-standard"
                          className="w-100"
                          value={userId}
                          onChange={handleOnChange}
                          label="User Id"
                        >
                          <MenuItem value={202}>deep@gmail.com</MenuItem>
                        </Select>
                      </FormControl>
                    {/* </div> */}
                    {/* <Select>
                      <option>Authorized Applicant</option>
                      <option>Developer</option>
                    </Select> */}
                    <div style={{ marginBottom: "24px", position: "relative", zIndex: 10 }} className="text-right">
                      {/* <Label id="otp-trigger" className="otp-prompt" label="CORE_LOGIN_NO_ACCOUNT" /> */}
                      <Link to="/user/register">
                        <div style={{ display: "inline-block" }}>
                          <Label containerStyle={{ cursor: "pointer" }} id="otp-resend" className="otp-resend" label="Forgot password ?" />
                        </div>
                      </Link>
                    </div>
                    <div style={{textAlign: 'center'}}>
                      <Button
                        {...submit}
                        style={{
                          height: "auto",
                          padding: '0.25rem 1.5rem',
                          width: "auto",
                          color: '#fff',
                          backgroundColor: '#337ab7'
                        }}
                        variant={"contained"}
                        color={"primary"}
                        onClick={() => {
                          startSMSRecevier();
                        }}
                      >
                        <Label  buttonLabel={true} labelStyle={{ fontWeight: 500 }} label="Send OTP" />
                      </Button>
                    </div>
                    
                    {/* <Button
            {...submit}
            fullWidth={true}
            primary={true}
            onClick={(e) => {
              startSMSRecevier();
            }}
          /> */}

                  </div>
                  {/* <div className="login-vl-divider">
       <div className ="login-circle-web">
       <Label  color="black" fontSize= "16px" label="OR"/>
       </div>
    </div> */}
                  {/* <div className="login-qrscan">
       <Image className="login-qrlogo" source={`${qrCodeURL}`} /> 
       <div  className="login-qrtext">
       <Label  color="black" fontSize= "14px" label="WHATSAPP_SCAN_QR_CODE"/>
       </div>
    </div> */}
                </div>
              </div>
            }
          />
        </Hidden>
      }
    </div>

  );
};

export default LoginForm;
