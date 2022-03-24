import { CardLabel, CardLabelError, Dropdown, LabelFieldPair, MobileNumber, TextInput } from "@egovernments/digit-ui-react-components";
import _ from "lodash";
import React from "react";
import { Controller, useForm } from "react-hook-form";

const WSPlumberDetails = ({ t, config, onSelect, userType, formData }) => {
  const [plumberDetails, setPlumberDetails] = React.useState(formData[config?.key] || {
    plumberName: "",
    plumberMobileNo: "",
    plumberLicenseNo:  "",
    plumberProvideBy: { code: "", value: "", i18nKey: "" },
  });
  const [focusedField, setFocusedField] = React.useState('');
  
  const { 
    control, 
    formState, 
    watch, 
    setError, 
    clearErrors, 
    trigger, 
  } = useForm();

  const formValues = watch();

  const setPlumberName = (props, value) => {
    const key = "plumberName";
    const error = { };

    if (!new RegExp(/^[a-zA-Z]{1, 50}/i).test(value) && !new RegExp(/^[a-zA-Z ]{1, 50}/i).test(value)) {
      error["type"] = "regex";
      error["message"] = "WS_INVALID_NAME";
    }

    if(Object.keys(error).length){
      setError(key, {type: error.type, message: error.message})
    }else{
      clearErrors(key);
    }

    props.onChange(value);
    setFocusedField("plumberName");
  }

  const setPlumberMobileNo = (props, value) => {
    const key = "plumberMobileNo";
    const error = { }

    if (!new RegExp(/^[6-9]{1}[0-9]{9}/i).test(value)) {
      error["type"] = "regex";
      error["message"] = "WS_INVALID_PHONE_NO"
    }

    if(Object.keys(error).length){
      setError(key, {type: error.type, message: error.message})
    }else{
      clearErrors(key);
    }

    props.onChange(value);
    setFocusedField(key);
  }

  const setPlumberLicenseNo = (props, value) => {
    const key = "plumberLicenseNo";
    const error = { }

    if (!new RegExp(/^[0-9]{1,10}/i).test(value)) {
      error["type"] = "regex";
      error["message"] = "WS_INVALID_LICENSE_NO"
    }

    if(Object.keys(error).length){
      setError(key, {type: error.type, message: error.message})
    }else{
      clearErrors(key);
    }

    props.onChange(value);
    setFocusedField(key);
    
  }

  const setPlumberProvidedBy = (props, value) => {
    const key = "plumberProvidedBy";
    const error = { }

    if (!Object.keys(value).length || !value?.value?.length ) {
      error["type"] = "regex";
      error["message"] = "WS_FIELD_CANT_BLANK"
    }

    if(Object.keys(error).length){
      setError(key, {type: error.type, message: error.message})
    }else{
      clearErrors(key);
    }

    props.onChange(value);
    setFocusedField(key);
  }

  React.useEffect(()=>{
    trigger();
  },[])

  React.useEffect(()=>{
    const part = {};

    Object.keys(formValues).forEach((key)=>part[key] = formValues[key]);

    if(!_.isEqual(part, plumberDetails)){
      setPlumberDetails(part);
      trigger();
    }
  },[formValues]);

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
            defaultValue={""}
            render={(props)=>(
              <Dropdown
                t={t}
                key={config?.key}
                selected={props.value}
                optionKey="i18nKey"
                select={(value) => setPlumberProvidedBy(props, value)}
              ></Dropdown>
            )}
          ></Controller>
        </div>
      </LabelFieldPair>
      { formState.touched?.plumberProvideBy && (
        <CardLabelError style={errorStyle}> {t(ormState.errors?.plumberProvideBy?.message)} </CardLabelError>
      )}

      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{t("WS_PLUMBER_LICENSE_NUMBER")}:</CardLabel>
        <div className="field">
          <Controller
            control={control}
            name="plumberLicenseNo"
            defaultValue={""}
            render={(props)=>(
              <TextInput
                type="text"
                key={config.key}
                value={props.value}
                autoFocus={focusedField === "plumberLicenseNo"}
                onBlur={props.onBlur}
                onChange={(ev) => setPlumberLicenseNo(props, ev.target.value)}
              ></TextInput>
            )}
          ></Controller>
        </div>
      </LabelFieldPair>
      { formState.touched?.plumberLicenseNo && (
        <CardLabelError style={errorStyle}> {t(formState.errors?.plumberLicenseNo?.message)} </CardLabelError>
      )}

      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{t("WS_PLUMBER_NAME")}:</CardLabel>
        <div className="field">
          <Controller
            control={control}
            name="plumberName"
            defaultValue={""}
            render={(props)=>(
              <TextInput
                key={config.key}
                type="text"
                value={props.value}
                autoFocus={focusedField === "plumberName"}
                onBlur={props.onBlur}
                onChange={(ev) => setPlumberName(props, ev.target.value)}
              ></TextInput>
            )}
          ></Controller>
        </div>
      </LabelFieldPair>
      { formState.touched?.plumberName && (
        <CardLabelError style={errorStyle}> {t(formState.errors?.plumberName?.message)} </CardLabelError>
      )}

      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{t("WS_PLUMBER_MOB_NUMBER")}:</CardLabel>
        <div className="field">
          <Controller
            control={control}
            name="plumberMobileNo"
            defaultValue={""}
            render={(props)=>(
              <MobileNumber
                key={config.key}
                type="number"
                value={props.value}
                autoFocus={focusedField === "plumberMobileNo"}
                onBlur={props.onBlur}
                onChange={(value) => setPlumberMobileNo(props, value)}
              ></MobileNumber>
            )}
          ></Controller>
        </div>
      </LabelFieldPair>
      { formState.touched?.plumberMobileNo && (
        <CardLabelError style={errorStyle}> {t(formState.errors?.plumberMobileNo?.message)} </CardLabelError> 
      )}
    </React.Fragment>
  );
};

export default WSPlumberDetails;
