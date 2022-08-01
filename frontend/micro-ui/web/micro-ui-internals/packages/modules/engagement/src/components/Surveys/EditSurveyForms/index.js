import { ActionBar, Card, SubmitBar, Menu } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useForm,FormProvider } from "react-hook-form";
import SurveyInfoLabel from "../../../utils/SurveyInfoLabel";
import SurveyDetailsForms from "../SurveyForms/SurveyDetailsForms";
import SurveyFormsMaker from "../SurveyForms/SurveyFormsMaker";
import SurveySettingsForms from "../SurveyForms/SurveySettingsForm";

const EditSurveyForms = ({ t, onEdit, menuOptions, initialSurveysConfig, isFormDisabled, isPartiallyEnabled, displayMenu, setDisplayMenu, onActionSelect ,isSurveyActive}) => {
  
  //for active surveys isPartiallyEnabled is true while editing and for inactive isFormDisabled is false
  const showActionBar = initialSurveysConfig?.status === "ACTIVE" ? !isPartiallyEnabled : isFormDisabled

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
    defaultValues: { ...initialSurveysConfig, collectCitizenInfo: initialSurveysConfig?.collectCitizenInfo?.code ? { code: true, name: t("ES_COMMON_YES") } : { code: false, name: t("ES_COMMON_NO") } },
  });

  useEffect(() => {
    registerRef("questions");
  }, []);
  return (
    <FormProvider {...{register: registerRef,
    control: controlSurveyForm,
    handleSubmit: handleSurveyFormSubmit,
    setValue: setSurveyFormValue,
    getValues: getSurveyFormValues,
    reset: resetSurveyForm,
    formState: surveyFormState,
    clearErrors: clearSurveyFormsErrors}}>
      <form onSubmit={handleSurveyFormSubmit(onEdit)}>
        <Card>
          {isPartiallyEnabled && initialSurveysConfig?.status ==="ACTIVE" && <SurveyInfoLabel t={t} />}
          <SurveyDetailsForms
            t={t}
            registerRef={registerRef}
            controlSurveyForm={controlSurveyForm}
            surveyFormState={surveyFormState}
            disableInputs={isFormDisabled}
            enableDescriptionOnly={isPartiallyEnabled}
            surveyFormData={getSurveyFormValues}
          />
          <SurveyFormsMaker t={t} setSurveyConfig={setSurveyFormValue} disableInputs={isFormDisabled} formsConfig={initialSurveysConfig.questions} isPartiallyEnabled={isPartiallyEnabled} formDisabled={isFormDisabled} controlSurveyForm={controlSurveyForm}/>
          <SurveySettingsForms
            t={t}
            controlSurveyForm={controlSurveyForm}
            surveyFormState={surveyFormState}
            disableInputs={isFormDisabled}
            enableEndDateTimeOnly={isPartiallyEnabled}
          />
          <span className="edit-action-btn">

          {!isSurveyActive && !isFormDisabled && <SubmitBar label={t("CS_EDIT_SURVEY")} submit="submit" disabled={isPartiallyEnabled ? !isPartiallyEnabled : isFormDisabled} /> }
          {isPartiallyEnabled && isSurveyActive && <SubmitBar label={t("CS_EDIT_SURVEY")} submit="submit" disabled={isPartiallyEnabled ? !isPartiallyEnabled : isFormDisabled} />}

          </span>
        </Card>
      </form>
      {/* Don't render the action bar after edit action is clicked-> to accomodate RAIN-7559 */}
      {showActionBar && <ActionBar>
        {displayMenu ? (
          <Menu localeKeyPrefix={"ES_SURVEY"} options={menuOptions} t={t} onSelect={onActionSelect} />
        ) : null}
        <SubmitBar label={t("ES_COMMON_TAKE_ACTION")} onSubmit={() => setDisplayMenu(!displayMenu)} />
      </ActionBar>}
    </FormProvider>
  );
};

export default EditSurveyForms;
