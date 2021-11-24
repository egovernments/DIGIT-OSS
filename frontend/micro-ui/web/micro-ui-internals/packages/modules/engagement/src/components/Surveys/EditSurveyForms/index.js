import { ActionBar, Card, SubmitBar, Menu } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import SurveyDetailsForms from "../SurveyForms/SurveyDetailsForms";
import SurveyFormsMaker from "../SurveyForms/SurveyFormsMaker";
import SurveySettingsForms from "../SurveyForms/SurveySettingsForm";

const EditSurveyForms = ({ t, onEdit, initialSurveysConfig, isFormDisabled = true, displayMenu, setDisplayMenu, onActionSelect }) => {
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
    defaultValues: initialSurveysConfig,
  });

  useEffect(() => {
    registerRef("questions");
  }, []);
  return (
    <div>
      <form onSubmit={handleSurveyFormSubmit(onEdit)}>
        <Card>
          <SurveyDetailsForms
            t={t}
            registerRef={registerRef}
            controlSurveyForm={controlSurveyForm}
            surveyFormState={surveyFormState}
            disableInputs={isFormDisabled}
          />
          <SurveyFormsMaker t={t} setSurveyConfig={setSurveyFormValue} disableInputs={isFormDisabled} />
          <SurveySettingsForms t={t} controlSurveyForm={controlSurveyForm} surveyFormState={surveyFormState} disableInputs={isFormDisabled} />
        </Card>

        <ActionBar>
          {displayMenu ? (
            <Menu localeKeyPrefix={"ES_SURVEY"} options={["EDIT", "INACTIVE", "ACTIVE", "DELETE"]} t={t} onSelect={onActionSelect} />
          ) : null}
          <SubmitBar label={t("ES_COMMON_TAKE_ACTION")} onSubmit={() => setDisplayMenu(!displayMenu)} />
        </ActionBar>
      </form>
    </div>
  );
};

export default EditSurveyForms;
