import {
  CloseSvg,
  SubmitBar,
  Header,
  StatusTable,
  Row,
  TextInput,
  MobileNumber,
  SearchForm,
  CardLabel,
  CardLabelError,
} from "@egovernments/digit-ui-react-components";
import React, { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router-dom";

const TYPE_REGISTER = { type: "register" };
const TYPE_LOGIN = { type: "login" };
let stateCode="";

  const sendOtp = async (data) => {
    try {
      const res = await Digit.UserService.sendOtp(data, stateCode);
      return [res, null];
    } catch (err) {
      return [null, err];
    }
  };

// TODO  @jagan make this component to reuse for multiple module
const UpdatePropertyNumber = ({ showPopup, property, t }) => {
  stateCode=Digit.ULBService.getStateId();
  const SelectOtp = Digit?.ComponentRegistryService?.getComponent("SelectOtp");

  const [updatePropertyState,setUpdatedProperty] =useState({name:property?.owners?.[0]?.name||"NA",
  mobileNumber: property?.owners?.[0]?.mobileNumber||"NA" 
} );
const [otpInfo,setOtpInfo]=useState({otpSentTo:false,isNewUser:false,invalid:false});


const onSubmit=useCallback(async(_data) => {

  if(_data?.mobileNumber==updatePropertyState.mobileNumber){
console.error("PT_SEC_SAME_NUMBER");
return;
  }
const requestData={ mobileNumber:_data?.mobileNumber,tenantId:stateCode,userType:"CITIZEN"};
//TODO  @jagan create a seperate hook later
   if(!otpInfo?.otpSentTo){
     /* send otp or create user flow */
  const [res, err] = await sendOtp({ otp: { ...requestData, ...TYPE_LOGIN } });
    if(err){
       const [registerResponse, registerError] = await sendOtp({ otp: { ...requestData,name:updatePropertyState?.name, ...TYPE_REGISTER } });
   if(!registerError){
     setOtpInfo((old)=>({...old,otpSentTo:_data?.mobileNumber,isNewUser:true}));
   }
    }else{
setOtpInfo((old)=>({...old,otpSentTo:_data?.mobileNumber}));
    }
   }else{
          /* authenticate or register user flow */
loginOrRegister(_data,(d)=>console.log(_data));

   }

});


 const loginOrRegister = async (_data,onSuccess) => {
    try {
      setOtpInfo(old=>({...old,invalid:false}));
      const { mobileNumber, otp } = _data;
      if (!otpInfo?.isNewUser) {
        const requestData = {
          username: mobileNumber,
          password: otp,
          tenantId: stateCode,
          userType: "CITIZEN",
        };

        const { ResponseInfo, UserRequest: info, ...tokens } = await Digit.UserService.authenticate(requestData);

       onSuccess&&onSuccess(_data);
      } else if (!isUserRegistered) {
        const requestData = {
          name:updatePropertyState?.name,
          username: mobileNumber,
          otpReference: otp,
          tenantId: stateCode,
        };

        const { ResponseInfo, UserRequest: info, ...tokens } = await Digit.UserService.registerUser(requestData, stateCode);
  onSuccess&&onSuccess(_data);
      }
    } catch (err) {
      setOtpInfo(old=>({...old,invalid:true}));
      console.log(err);
    }
  };

const resendOtp = async () => {
    const data = {
      mobileNumber:otpInfo?.otpSentTo,
      tenantId:stateCode,
     userType:"CITIZEN",
    };
    if (otpInfo?.isNewUser) {
      const [res, err] = await sendOtp({ otp: { ...data, ...TYPE_REGISTER } });
    } else {
      const [res, err] = await sendOtp({ otp: { ...data, ...TYPE_LOGIN } });
    }
  }


  const { register, control, handleSubmit, getValues, reset, formState } = useForm({
    defaultValues: {
      mobileNumber: "",
      otp: "",
    },
  });




  return (
    <div className="popup-module updatePropertyNumber">
      <div className="popup-close-icon" onClick={() => showPopup(false)}>
        <CloseSvg />
      </div>

      <Header>{t("PTUPNO_HEADER")}</Header>
      <SearchForm onSubmit={onSubmit} handleSubmit={handleSubmit}>
        <StatusTable>
          <Row label={t("PTUPNO_OWNER_NAME")} text={`${updatePropertyState?.name || t("CS_NA")}`} />
          <Row label={t("PTUPNO_CURR_NO")} text={`${updatePropertyState?.mobileNumber || t("CS_NA")}`} />
          <CardLabel style={{ marginBottom: "8px" }}>{t("PT_UPDATE_NEWNO")}</CardLabel>
          <MobileNumber
            className="field pt-update-no-field"
            name="mobileNumber"
            inputRef={register({
              value: getValues("mobileNumber"),
              shouldUnregister: true,
              ...{
                required: "MANDATORY_MOBILE",
                minLength: {
                  value: 10,
                  message: "CORE_COMMON_MOBILE_ERROR",
                },
                maxLength: {
                  value: 10,
                  message: "CORE_COMMON_MOBILE_ERROR",
                },
                pattern: {
                  value: /[789][0-9]{9}/,
                  message: "CORE_COMMON_MOBILE_ERROR",
                },
              },
            })}
            disable={otpInfo?.otpSentTo&&true}
          />
          <CardLabelError style={{ marginTop: "-10px" }}>{t(formState?.errors?.mobileNumber?.message)}</CardLabelError>
          {otpInfo?.otpSentTo&&<Controller
            control={control}
            name="otp"
            render={(props, customProps) => (
              <SelectOtp
                userType="employee"
                config={{ header: "OTP Verification", cardText: "Enter the OTP sent to 9965664222", nextText: "Next", submitBarLabel: "Next" }}
                onOtpChange={(d) => {
                  props.onChange(d);
                }}
                onResend={resendOtp}
                onSelect={(e) => console.log(e)}
                error={!otpInfo.invalid}
                t={t}
                otp={props.value}
              />
            )}
          />}
        </StatusTable>
        <SubmitBar label={t(otpInfo?.otpSentTo?"PTUPNO_VERUPD_NO":"PTUPNO_SENDOTP")} submit />
      </SearchForm>
    </div>
  );
};
export default UpdatePropertyNumber;


//PT_SEC_OTP_SENT_SUCEESS
//PT_MOBILE_NUM_UPDATED_SUCCESS
//PT_SEC_OTP_SENT_FAILURE
        // if (result.error && result.error.fields[0] && result.error.fields[0].code == "OTP.VALIDATION_UNSUCCESSFUL") {
// PT_SEC_SAME_NUMBER