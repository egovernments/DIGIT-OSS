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
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router-dom";

const UpdatePropertyNumber = ({ showPopup, property, t }) => {
  const SelectOtp = Digit?.ComponentRegistryService?.getComponent("SelectOtp");
  const { register, control, handleSubmit, setValue, watch, getValues, reset, formState } = useForm({
    defaultValues: {
      mobileNumber: "",
      otp: "",
    },
  });
  const formValue = watch();

  return (
    <div className="popup-module updatePropertyNumber">
      <div className="popup-close-icon" onClick={() => showPopup(false)}>
        <CloseSvg />
      </div>

      <Header>{t("PTUPNO_HEADER")}</Header>
      <SearchForm onSubmit={(_data) => console.log(_data)} handleSubmit={handleSubmit}>
        <StatusTable>
          <Row label={t("PTUPNO_OWNER_NAME")} text={`${property?.owners?.[0]?.name || t("CS_NA")}`} />
          <Row label={t("PTUPNO_CURR_NO")} text={`${property?.owners?.[0]?.mobileNumber || t("CS_NA")}`} />
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
            disable={false}
          />
          <CardLabelError style={{ marginTop: "-10px" }}>{t(formState?.errors?.mobileNumber?.message)}</CardLabelError>
          <Controller
            control={control}
            name="otp"
            render={(props, customProps) => (
              <SelectOtp
                userType="employee"
                config={{ header: "OTP Verification", cardText: "Enter the OTP sent to 9965664222", nextText: "Next", submitBarLabel: "Next" }}
                onOtpChange={(d) => {
                  props.onChange(d);
                }}
                onResend={(e) => console.log(e)}
                onSelect={(e) => console.log(e)}
                error={false}
                t={t}
                otp={props.value}
              />
            )}
          />
        </StatusTable>
        {/* <SubmitBar label={t("PTUPNO_SENDOTP")} onClick={(e) => console.log("clicked", e)} /> */}
        <SubmitBar label={t("PTUPNO_SENDOTP")} submit />
      </SearchForm>
    </div>
  );
};
export default UpdatePropertyNumber;
