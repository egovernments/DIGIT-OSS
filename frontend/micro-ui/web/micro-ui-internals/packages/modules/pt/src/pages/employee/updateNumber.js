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

const defaultState = {
  
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
  console.log(state,action);
  switch (action.type) {
    case "verifiedotp":
      return { ...state, previousAction: action.type, message: "", disable:false,showToast: false, error: true, warning: false, invalid: true };
    case "verifyotp":
      return { ...state, previousAction: action.type, message: "", disable: true, showToast: false, error: true, warning: false, invalid: false };
    case "otpsent":
      return {
        ...state,
        previousAction: action.type,
        message: "PT_SEC_OTP_SENT_SUCEESS",
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



// TODO make this component to reuse for multiple module
const UpdateNumber = ({ t, onValidation, mobileNumber, name ,UpdateNumberConfig}) => {
  const [compState, compStateDispatch] = useReducer(compStateReducer, { ...defaultState, name: name, mobileNumber: mobileNumber });

  const onSubmit = useCallback(async (_data) => {
    compStateDispatch({ type: "resettoast" });
    
    let invalidNo=(UpdateNumberConfig?.invalidNumber===_data?.mobileNumber&&"PTUPNO_INVALIDNO_HEADER")||false;
    invalidNo=_data?.mobileNumber === compState.mobileNumber?"PT_SEC_SAME_NUMBER":invalidNo;
    if (invalidNo) {
      compStateDispatch({ type: "warning", value: invalidNo });
      return;
    } else {
      onValidation && onValidation(_data, (d) => {
        compStateDispatch({ type: "success", value: "PT_MOBILE_NUM_UPDATED_SUCCESS" });
      });
    }
  }, [compState]);


  const { register, control, handleSubmit, getValues, reset, formState } = useForm({
    defaultValues: {
      mobileNumber: "",
    },
  });

  return (
    <div className="popup-module updateNumberEmployee">     
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
                  value: /[789][0-9]{9}/,
                  message: "CORE_COMMON_MOBILE_ERROR",
                },
              },
            })}
            disable={compState.disable}
          />
          <CardLabelError style={{ marginTop: "-10px" }}>{t(formState?.errors?.mobileNumber?.message)}</CardLabelError>
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
        <SubmitBar label={t( "ES_COMMON_UPDATE")} submit disabled={compState.disable} />
      </SearchForm>
    </div>
  );
};
export default UpdateNumber;
