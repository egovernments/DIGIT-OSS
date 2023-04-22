import React from "react";
import { useForm } from "react-hook-form";
import { ActionBar, Header, Loader, SubmitBar, Toast } from "@egovernments/digit-ui-react-components";

import CitizenSurveyQuestion from "./CitizenSurveyQuestion";
import { useTranslation } from "react-i18next";


const CitizenSurveyForm = ({ surveyData, onFormSubmit,submitDisabled,formDisabled,formDefaultValues,isLoading, showToast, isSubmitDisabled }) => {
  //need to disable this form and fill with default values if formDisabled is true
  const {
    register: registerRef,
    control: controlSurveyForm,
    handleSubmit: handleSurveyFormSubmit,
    setValue: setSurveyFormValue,
    getValues: getSurveyFormValues,
    reset: resetSurveyForm,
    formState: surveyFormState,
    clearErrors: clearSurveyFormsErrors,
  } = useForm({
    defaultValues:formDefaultValues
  });

  const {t} = useTranslation()
  if(isLoading){
    return <Loader/>
  }
  return (
    <div className="citizenSurvey-wrapper">
      <Header>{surveyData?.title?.toUpperCase()}</Header>
      <form onSubmit={handleSurveyFormSubmit(onFormSubmit)}>
        {surveyData?.questions?.length ? surveyData.questions.map((config, index) => <CitizenSurveyQuestion key={index} t={t} question={config} control={controlSurveyForm} register={registerRef} values={getSurveyFormValues} formState={surveyFormState} formDisabled={formDisabled} index={index}/>) : null}
        {showToast && <Toast error={showToast.key} label={t(showToast.label)} />}
        <ActionBar>
          {!submitDisabled && <SubmitBar disabled={isSubmitDisabled} label={t("CS_SUBMIT_SURVEY")} submit="submit" />}
        </ActionBar>
      </form>
    </div>
  );
};

export default CitizenSurveyForm;
