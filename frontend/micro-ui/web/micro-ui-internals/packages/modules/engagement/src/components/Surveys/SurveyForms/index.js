import { ActionBar, Card, SubmitBar } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import SurveyDetailsForms from "./SurveyDetailsForms";
import SurveyFormsMaker from "./SurveyFormsMaker";
import SurveySettingsForms from "./SurveySettingsForm";

const CreateNewSurvey = ({ t, initialFormValues, onSubmit, isFormDisabled = false }) => {
  const {
    register: registerRef,
    control: controlSurveyForm,
    handleSubmit: handleSurveyFormSubmit,
    setValue: setSurveyFormValue,
    getValues: getSurveyFormValues,
    reset: resetSurveyForm,
    formState: surveyFormState,
    clearErrors: clearSurveyFormsErrors,
    ...methods
  } = useForm({
    defaultValues: initialFormValues,
  });

  useEffect(() => {
    registerRef("questions");
  }, []);
  return (
    <div style={{margin:"8px"}}>
      <FormProvider {...{
        register: registerRef,
        control: controlSurveyForm,
        handleSubmit: handleSurveyFormSubmit,
        setValue: setSurveyFormValue,
        getValues: getSurveyFormValues,
        reset: resetSurveyForm,
        formState: surveyFormState,
        clearErrors: clearSurveyFormsErrors,
        ...methods
      }}>
        <form onSubmit={handleSurveyFormSubmit(onSubmit)}>
          <Card>
            <SurveyDetailsForms
              t={t}
              registerRef={registerRef}
              controlSurveyForm={controlSurveyForm}
              surveyFormState={surveyFormState}
              surveyFormData={getSurveyFormValues}
            />
            <SurveyFormsMaker t={t} setSurveyConfig={setSurveyFormValue} addOption={true} controlSurveyForm={controlSurveyForm} />
            <SurveySettingsForms t={t} controlSurveyForm={controlSurveyForm} surveyFormState={surveyFormState} />
          </Card>

          <ActionBar>
            <SubmitBar label={t("CS_CREATE_SURVEY")} submit="submit" />
          </ActionBar>
        </form>
      </FormProvider>
    </div>
  );
};

export default CreateNewSurvey;
