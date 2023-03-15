import React, { useEffect,useMemo } from "react";
import { CardLabelError, TextInput, RadioButtons } from "@egovernments/digit-ui-react-components";
import { Controller, useFormContext } from "react-hook-form";

 const ConvertEpochToDate = (dateEpoch) => {
  if (dateEpoch == null || dateEpoch == undefined || dateEpoch == "") {
    return "NA";
  }
  const dateFromApi = new Date(dateEpoch);
  let month = dateFromApi.getMonth() + 1;
  let day = dateFromApi.getDate();
  let year = dateFromApi.getFullYear();
  month = (month > 9 ? "" : "0") + month;
  day = (day > 9 ? "" : "0") + day;
  return `${year}-${month}-${day}`;
};

const SurveySettingsForms = ({ t, controlSurveyForm, surveyFormState, disableInputs, enableEndDateTimeOnly }) => {
  
  const formErrors = surveyFormState?.errors;
  
  const { getValues } = useFormContext()
  const currentTs = new Date().getTime()
  const isValidFromDate = (enteredValue) => {
    
    const enteredTs = new Date(enteredValue).getTime()
    const toDate = getValues("toDate") ? new Date(getValues("toDate")).getTime() : new Date().getTime()
    // return ( toDate > enteredTs && enteredTs >= currentTs ) ? true : false 
    //same day check
    if (enteredValue === getValues("toDate") && enteredValue >= ConvertEpochToDate(currentTs)) return true
    return (toDate >= enteredTs && enteredValue >= ConvertEpochToDate(currentTs) ) ? true : false 
    
  };
  const isValidToDate = (enteredValue) => {
    const enteredTs = new Date(enteredValue).getTime()
    const fromDate = getValues("fromDate") ? new Date(getValues("fromDate")).getTime() : new Date().getTime()
    //return ( enteredTs >= fromDate && enteredTs >= currentTs ) ? true : false 
    return (enteredTs >= fromDate ) ? true : false
  };
  const isValidFromTime = () => true;
  const isValidToTime = () => true;

  return (
    <div className="surveydetailsform-wrapper">
      <div className="heading">{t("CS_COMMON_SETTINGS")}</div>
      <span className="surveyformfield">
        <label>{`${t("LABEL_SURVEY_START_DATE")} * `}</label>
        <Controller
          control={controlSurveyForm}
          name="fromDate"
          defaultValue={surveyFormState?.fromDate}
          rules={{ required: true, validate: !enableEndDateTimeOnly? { isValidFromDate }:null }}
          render={({ onChange, value }) => <TextInput type="date" onChange={onChange} defaultValue={value} disable={disableInputs}/>}
        />
        {formErrors && formErrors?.fromDate && formErrors?.fromDate?.type === "required" && (
          <CardLabelError>{t(`EVENTS_TO_DATE_ERROR_REQUIRED`)}</CardLabelError>
        )}
        {formErrors && formErrors?.fromDate && formErrors?.fromDate?.type === "isValidFromDate" && (
          <CardLabelError>{t(`EVENTS_FROM_DATE_ERROR_INVALID`)}</CardLabelError>
        )}
      </span>

      <span className="surveyformfield">
        <label>{`${t("LABEL_SURVEY_START_TIME")} * `}</label>
        <Controller
          control={controlSurveyForm}
          name="fromTime"
          defaultValue={surveyFormState?.fromTime}
          rules={{ required: true, validate: { isValidFromTime } }}
          render={({ onChange, value }) => <TextInput type="time" onChange={onChange} defaultValue={value} disable={disableInputs} />}
        />
        {formErrors && formErrors?.fromTime && formErrors?.fromTime?.type === "required" && (
          <CardLabelError>{t(`EVENTS_TO_DATE_ERROR_REQUIRED`)}</CardLabelError>
        )}
        {formErrors && formErrors?.fromTime && formErrors?.fromTime?.type === "isValidFromDate" && (
          <CardLabelError>{t(`EVENTS_TO_DATE_ERROR_INVALID`)}</CardLabelError>
        )}
      </span>

      <span className="surveyformfield">
        <label>{`${t("LABEL_SURVEY_END_DATE")} * `}</label>
        <Controller
          control={controlSurveyForm}
          name="toDate"
          defaultValue={surveyFormState?.toDate}
          rules={{ required: true, validate: { isValidToDate } }}
          render={({ onChange, value }) => <TextInput type="date" onChange={onChange} defaultValue={value} disable={enableEndDateTimeOnly ? !enableEndDateTimeOnly : disableInputs}/>}
        />
        {formErrors && formErrors?.toDate && formErrors?.toDate?.type === "required" && (
          <CardLabelError>{t(`EVENTS_TO_DATE_ERROR_REQUIRED`)}</CardLabelError>
        )}
        {formErrors && formErrors?.toDate && formErrors?.toDate?.type === "isValidToDate" && (
          <CardLabelError>{t(`EVENTS_TO_DATE_ERROR_INVALID`)}</CardLabelError>
        )}{" "}
      </span>

      <span className="surveyformfield">
        <label>{`${t("LABEL_SURVEY_END_TIME")} * `}</label>

        <Controller
          control={controlSurveyForm}
          name="toTime"
          defaultValue={surveyFormState?.toTime}
          rules={{ required: true, validate: { isValidToTime } }}
          render={({ onChange, value }) => <TextInput type="time" onChange={onChange} defaultValue={value} disable={enableEndDateTimeOnly ? !enableEndDateTimeOnly : disableInputs}/>}
        />
        {formErrors && formErrors?.toTime && formErrors?.toTime?.type === "required" && (
          <CardLabelError>{t(`EVENTS_TO_DATE_ERROR_REQUIRED`)}</CardLabelError>
        )}
        {formErrors && formErrors?.toTime && formErrors?.toTime?.type === "isValidToDate" && (
          <CardLabelError>{t(`EVENTS_TO_DATE_ERROR_INVALID`)}</CardLabelError>
        )}
      </span>
    </div>
  );
};

export default SurveySettingsForms;
