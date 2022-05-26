import {
  CardLabel,
  CardLabelError,
  CloseSvg,
  Header,
  MobileNumber,
  Row,
  SearchForm,
  StatusTable,
  SubmitBar,
  Toast
} from "@egovernments/digit-ui-react-components";
import React, { useCallback, useReducer } from "react";
import { Controller, useForm } from "react-hook-form";

const TYPE_REGISTER = { type: "register" };
const TYPE_LOGIN = { type: "login" };

const defaultState = {
  otpSentTo: false,
  isNewUser: false,
  invalid: false,
  showToast: null,
  error: false,
  warning: false,
  name: "",
  message: "",
  mobileNumber: "",
  previousAction: null,
  disable: false,
};

const compStateReducer = (state, action) => {
  switch (action.type) {
    case "verifiedotp":
      return { ...state, previousAction: action.type, message: "", disable: false, showToast: false, error: true, warning: false, invalid: true };
    case "verifyotp":
      return { ...state, previousAction: action.type, message: "", disable: true, showToast: false, error: true, warning: false, invalid: false };
    case "otpsent":
      return {
        ...state,
        previousAction: action.type,
        message: "PT_SEC_OTP_SENT_SUCEESS",
        otpSentTo: action.value,
        isNewUser: action.isNewUser,
        showToast: true,
        error: false,
        warning: false,
      };
    case "resettoast":
      return { ...state, previousAction: action.type, message: "", showToast: false, error: false, warning: false };
    case "success":
      return { ...state, previousAction: action.type, message: action.value, showToast: true, warning: false, error: false };
    case "warning":
      return { ...state, previousAction: action.type, message: action.value, showToast: true, warning: true, error: false };
    case "error":
      return { ...state, previousAction: action.type, message: action.value, showToast: true, error: true };
    case "reset":
      return { ...defaultState };
    default:
      return { ...defaultState };
  }
};

const sendOtp = async (data, stateCode) => {
  try {
    const res = await Digit.UserService.sendOtp(data, stateCode);
    return [res, null];
  } catch (err) {
    return [null, err];
  }
};

// TODO make this component to reuse for multiple module
const UpdateNumber = ({ showPopup, t, onValidation, mobileNumber, name, UpdateNumberConfig }) => {
  const stateCode = Digit.ULBService.getStateId();
  const [compState, compStateDispatch] = useReducer(compStateReducer, { ...defaultState, name: name, mobileNumber: mobileNumber });
  const SelectOtp = Digit?.ComponentRegistryService?.getComponent("SelectOtp");

  const onSubmit = useCallback(
    async (_data) => {
      compStateDispatch({ type: "resettoast" });

      let invalidNo = (UpdateNumberConfig?.invalidNumber === _data?.mobileNumber && "PTUPNO_INVALIDNO_HEADER") || false;
      invalidNo = _data?.mobileNumber === compState.mobileNumber ? "PT_SEC_SAME_NUMBER" : invalidNo;
      if (invalidNo) {
        compStateDispatch({ type: "warning", value: invalidNo });
        return;
      } else {
        const requestData = { mobileNumber: _data?.mobileNumber, tenantId: stateCode, userType: "CITIZEN" };
        if (compState.otpSentTo == false) {
          /* send otp or create user flow */
          const [res, err] = await sendOtp({ otp: { ...requestData, ...TYPE_LOGIN } }, stateCode);
          if (err) {
            const [registerResponse, registerError] = await sendOtp({ otp: { ...requestData, name: compState?.name, ...TYPE_REGISTER } }, stateCode);
            if (!registerError) {
              compStateDispatch({ type: "otpsent", value: _data?.mobileNumber, isNewUser: true });
            } else {
              compStateDispatch({ type: "error", value: registerError });
            }
          } else {
            compStateDispatch({ type: "otpsent", value: _data?.mobileNumber });
          }
        } else {
          /* authenticate or register user flow */
          loginOrRegister(_data, (d) => {
            compStateDispatch({ type: "success", value: "PT_MOBILE_NUM_UPDATED_SUCCESS" });
          });
        }
      }
    },
    [compState]
  );

  const loginOrRegister = async (_data, onSuccess) => {
    try {
      compStateDispatch({ type: "verifyotp" });
      const { mobileNumber, otp } = _data;
      if (!compState?.isNewUser) {
        const { ResponseInfo, UserRequest: info, ...tokens } = await Digit.UserService.authenticate({
          username: mobileNumber,
          password: otp,
          tenantId: stateCode,
          userType: "CITIZEN",
        });
        onValidation && onValidation(_data, onSuccess);
      } else {
        const { ResponseInfo, UserRequest: info, ...tokens } = await Digit.UserService.registerUser(
          {
            name: compState?.name,
            username: mobileNumber,
            otpReference: otp,
            tenantId: stateCode,
          },
          stateCode
        );
        onValidation && onValidation(_data, onSuccess);
      }
    } catch (err) {
      compStateDispatch({ type: "verifiedotp" });
    }
  };

  const resendOtp = useCallback(async () => {
    const data = {
      mobileNumber: compState?.otpSentTo,
      tenantId: stateCode,
      userType: "CITIZEN",
    };
    if (compState?.isNewUser) {
      const [res, err] = await sendOtp({ otp: { ...data, ...TYPE_REGISTER } }, stateCode);
    } else {
      const [res, err] = await sendOtp({ otp: { ...data, ...TYPE_LOGIN } }, stateCode);
    }
  }, [compState]);

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
          <Row label={t("PTUPNO_OWNER_NAME")} text={`${compState?.name || t("CS_NA")}`} />
          <Row label={t("PTUPNO_CURR_NO")} text={`${compState?.mobileNumber || t("CS_NA")}`} />
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
                  value: /[6789][0-9]{9}/,
                  message: "CORE_COMMON_MOBILE_ERROR",
                },
              },
            })}
            disable={compState?.otpSentTo && true}
          />
          <CardLabelError style={{ marginTop: "-10px" }}>{t(formState?.errors?.mobileNumber?.message)}</CardLabelError>
          {compState?.otpSentTo && (
            <Controller
              control={control}
              name="otp"
              rules={{
                required: "MANDATORY_OTP",
                minLength: {
                  value: 6,
                  message: "CORE_COMMON_OTP_ERROR",
                },
              }}
              render={(props, customProps) => (
                <SelectOtp
                  userType="employee"
                  config={{ header: "OTPVERIFICATION", cardText: "ENTEROTP", nextText: "Next", submitBarLabel: "Next" }}
                  onOtpChange={(d) => {
                    props.onChange(d);
                  }}
                  onResend={resendOtp}
                  error={!compState.invalid}
                  t={t}
                  otp={props.value}
                />
              )}
            />
          )}
        </StatusTable>
        {compState.showToast && (
          <Toast
            error={compState.error}
            warning={compState.warning}
            label={t(compState.message)}
            onClose={() => {
              compStateDispatch({ type: "resettoast" });
            }}
          />
        )}
        <SubmitBar label={t(compState?.otpSentTo ? "PTUPNO_VERUPD_NO" : "PTUPNO_SENDOTP")} submit disabled={compState.disable} />
      </SearchForm>
    </div>
  );
};
export default UpdateNumber;
