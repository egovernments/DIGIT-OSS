import { CardLabel, CardLabelError, Dropdown, LabelFieldPair, MobileNumber, TextInput } from "@egovernments/digit-ui-react-components";
import _ from "lodash";
import React from "react";
import { getPattern } from "../utils";
import { Controller, useForm } from "react-hook-form";
const WSPlumberDetails = ({ t, config, onSelect, formData,formState,setError,clearErrors}) => {
  const [plumberDetails, setPlumberDetails] = React.useState(formData[config?.key] || {
    plumberName: "",
    plumberMobileNo: "",
    plumberLicenseNo:  "",
  });
  const [plumberProvidedBy, setPlumberProvidedBy] = React.useState({code: "ULB", value: "ULB", i18nKey: "ULB"});
  const [plumberProvidedByOptions] = React.useState([
    {code: "ULB", value: "ULB", i18nKey: "ULB"},
    {code: "SELF", value: "SELF", i18nKey: "SELF"},
  ]);
  const [isErrors, setIsErrors] = React.useState(false);
  const [focusedField, setFocusedField] = React.useState('');

  const { 
    control, 
    formState : localFormState, 
    watch, 
    trigger, 
  } = useForm();

  const formValues = watch();

  const isPlumberProvidedByULB = () => plumberProvidedBy.code === "ULB";
  React.useEffect(()=>{
    trigger();
  },[])

  React.useEffect(()=>{
    const part = {};

    Object.keys(formValues).forEach((key)=>part[key] = formValues[key]);

    if(!_.isEqual(part, plumberDetails)){
      let isErrorsFound = true;

      Object.keys(formValues).map(data => {
        if (!formValues[data] && isErrorsFound) {
          isErrorsFound = false
          setIsErrors(false);
        }
      });

      if (isErrorsFound) setIsErrors(true);

      setPlumberDetails(part);
      trigger();
    }
  },[formValues]);

  React.useEffect(() => {
    let isClear = true;

    Object.keys(plumberDetails).map(key => {
      if (!plumberDetails[key] && isClear) isClear = false
    })

    if (isClear && Object.keys(plumberDetails).length) {
      clearErrors("PlumberDetails");
    }

    if (plumberDetails.plumberName) clearErrors(config.key, { type: "plumberName" })
    if (plumberDetails.plumberMobileNo) clearErrors(config.key, { type: "plumberMobileNo" })
    if (plumberDetails.plumberLicenseNo) clearErrors(config.key, { type: "plumberLicenseNo" })

    trigger();
  }, [plumberDetails]);

  React.useEffect(() => {
    if(! isPlumberProvidedByULB()){
    if (Object.keys(localFormState.errors).length && !_.isEqual(formState.errors[config.key]?.type || {}, localFormState.errors)) {
      setError(config.key, { type: localFormState.errors });
    }
    else if (!Object.keys(localFormState.errors).length && formState.errors[config.key] && isErrors) {
      clearErrors(config.key);
    }}
  }, [localFormState.errors]);
  
  React.useEffect(() => {
    onSelect(config.key, plumberDetails);
  }, [plumberDetails]);

  const errorStyle = { width: "70%", marginLeft: "30%", fontSize: "12px", marginTop: "-21px" };

  return (
    <React.Fragment>
      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{t("WS_PLUMBER_PROVIDED_BY")}:</CardLabel>
        <div className="field">
          <Controller
            control={control}
            name="plumberProvidedBy"
            defaultValue={plumberDetails.plumberProvidedBy}
            render={(props)=>(
              <Dropdown
                t={t}
                key={config?.key}
                selected={props.value}
                optionKey="i18nKey"
                option={plumberProvidedByOptions}
                select={(value) => {
                  props.onChange(value);
                  setPlumberProvidedBy(value)
                }}
              ></Dropdown>
            )}
          ></Controller>
        </div>
      </LabelFieldPair>
      { localFormState.touched?.plumberProvideBy && (
        <CardLabelError style={errorStyle}> {t(ormState.errors?.plumberProvideBy?.message)} </CardLabelError>
      )}

      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{t("WS_PLUMBER_LICENSE_NUMBER")}:</CardLabel>
        <div className="field">
          <Controller
            control={control}
            name="plumberLicenseNo"
            type="text"
            defaultValue={plumberDetails.plumberLicenseNo}
            rules={{
              validate: (e)=>e && getPattern("OldLicenceNo").test(e) ? true: t(""),
              required: t("REQUIRED_FIELD") ,
            }}
            render={(props)=>(
              <TextInput
                type="text"
                key={config.key}
                value={props.value}
                autoFocus={focusedField === "plumberLicenseNo"}
                disable={isPlumberProvidedByULB()}
                onBlur={props.onBlur}
                onChange={(ev) => {
                  props.onChange(ev.target.value);
                  setFocusedField("plumberLicenseNo");
                }}
              ></TextInput>
            )}
          ></Controller>
        </div>
      </LabelFieldPair>
      { localFormState.touched?.plumberLicenseNo && (
        <CardLabelError style={errorStyle}> {t(localFormState.errors?.plumberLicenseNo?.message)} </CardLabelError>
      )}

      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{t("WS_PLUMBER_NAME")}:</CardLabel>
        <div className="field">
          <Controller
            control={control}
            name="plumberName"
            type="text"
            defaultValue={plumberDetails.plumberName}
            rules={{
              validate: (e)=>e && getPattern("Name").test(e) ? true: t(""),
              required: t("REQUIRED_FIELD") ,
            }}
            render={(props)=>(
              <TextInput
                key={config.key}
                type="text"
                disable={isPlumberProvidedByULB()}
                value={props.value}
                autoFocus={focusedField === "plumberName"}
                onBlur={props.onBlur}
                onChange={(ev) => {
                  props.onChange(ev.target.value);
                  setFocusedField("plumberName");
                }}
              ></TextInput>
            )}
          ></Controller>
        </div>
      </LabelFieldPair>
      { localFormState.touched?.plumberName && (
        <CardLabelError style={errorStyle}> {t(localFormState.errors?.plumberName?.message)} </CardLabelError>
      )}

      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{t("WS_PLUMBER_MOB_NUMBER")}:</CardLabel>
        <div className="field">
          <Controller
            control={control}
            type="number"
            name="plumberMobileNo"
            defaultValue={plumberDetails.plumberMobileNo}
            rules={{
              validate: (e)=>e && getPattern("MobileNo").test(e) ? true: t(""),
              required: t("REQUIRED_FIELD") ,
            }}
            render={(props)=>(
              <MobileNumber
                key={config.key}
                type="number"
                value={props.value}
                disable={isPlumberProvidedByULB()}
                autoFocus={focusedField === "plumberMobileNo"}
                onBlur={props.onBlur}
                onChange={(value) => {
                  props.onChange(value);
                  setFocusedField("plumberMobileNo");
                }}
              ></MobileNumber>
            )}
          ></Controller>
        </div>
      </LabelFieldPair>
      { localFormState.touched?.plumberMobileNo && (
        <CardLabelError style={errorStyle}> {t(localFormState.errors?.plumberMobileNo?.message)} </CardLabelError> 
      )}
    </React.Fragment>
  );
};

export default WSPlumberDetails;