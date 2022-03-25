import { CardLabel, CardLabelError, Dropdown, LabelFieldPair, MobileNumber, TextInput } from "@egovernments/digit-ui-react-components";
import _ from "lodash";
import React from "react";
import { getPattern } from "../utils";
import { Controller, useForm } from "react-hook-form";

const WSPlumberDetails = ({ t, config, onSelect, formData }) => {
  const [plumberDetails, setPlumberDetails] = React.useState(formData[config?.key] || {
    plumberName: "",
    plumberMobileNo: "",
    plumberLicenseNo:  "",
    plumberProvideBy: { code: "", value: "", i18nKey: "" },
  });
  const [plumberProvidedByOptions, setPlumberProvidedByOptions] = React.useState([]);
  const [focusedField, setFocusedField] = React.useState('');
  
  const { 
    isWSServicesCalculationLoading, 
    data: wsServicesCalculationData
   } = Digit.Hooks.ws.useMDMS(Digit.ULBService.getStateId(), "ws-services-calculation", ["PlumberProvidedBy"]);

  const { 
    control, 
    formState, 
    watch, 
    setError, 
    clearErrors, 
    trigger, 
  } = useForm();

  const formValues = watch();

  const isPlumberProvideByULB = () => {
    // if plumber provided is ULB
    return true;
  }

  React.useEffect(()=>{
    trigger();
  },[])

  React.useEffect(()=>{
    const plumberProvidedBy = wsServicesCalculationData?.["ws-services-calculation"]?.PlumberProvidedBy
    ?.map((type)=>({...type, i18nKey: type.code})) || [{code: "ULB", value: "ULB", i18nKey:"ULB"}];
    setPlumberProvidedByOptions(plumberProvidedByOptions)
  }, [wsServicesCalculationData])

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
                }}
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
                disable={isPlumberProvideByULB()}
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
      { formState.touched?.plumberLicenseNo && (
        <CardLabelError style={errorStyle}> {t(formState.errors?.plumberLicenseNo?.message)} </CardLabelError>
      )}

      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{t("WS_PLUMBER_NAME")}:</CardLabel>
        <div className="field">
          <Controller
            control={control}
            name="plumberName"
            defaultValue={plumberDetails.plumberName}
            rules={{
              validate: (e)=>e && getPattern("Name").test(e) ? true: t(""),
              required: t("REQUIRED_FIELD") ,
            }}
            render={(props)=>(
              <TextInput
                key={config.key}
                type="text"
                disable={isPlumberProvideByULB()}
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
      { formState.touched?.plumberName && (
        <CardLabelError style={errorStyle}> {t(formState.errors?.plumberName?.message)} </CardLabelError>
      )}

      <LabelFieldPair>
        <CardLabel className="card-label-smaller">{t("WS_PLUMBER_MOB_NUMBER")}:</CardLabel>
        <div className="field">
          <Controller
            control={control}
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
                disable={isPlumberProvideByULB()}
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
      { formState.touched?.plumberMobileNo && (
        <CardLabelError style={errorStyle}> {t(formState.errors?.plumberMobileNo?.message)} </CardLabelError> 
      )}
    </React.Fragment>
  );
};

export default WSPlumberDetails;
