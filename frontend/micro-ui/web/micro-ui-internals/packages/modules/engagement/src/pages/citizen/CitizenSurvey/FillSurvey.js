import React from "react";
import { useHistory } from "react-router-dom";
import  { useState, useEffect } from "react";
import CitizenSurveyForm from "../../../components/Surveys/CitizenSurveyForm";
import NoSurveyFoundPage from "../../../components/Surveys/NoSurveyFoundPage";
import { useTranslation } from "react-i18next";

const transformSurveyResponseData = (data) => {
    /**
     * TODO : handle checkbox
     */
  if (!data) return;
  const questions = [];
  for (const key in data) {
    questions.push({
      questionId: key,
      answer: [data[key]],
    });
  }
  return questions;
};

const FillSurvey = ({ location }) => {
  
  //const surveyData = location?.state;
  const { applicationNumber: surveyId, tenantId } = Digit.Hooks.useQueryParams();
  const { data, isLoading } = Digit.Hooks.survey.useSearch({uuid:surveyId,tenantId},{})
  const surveyData = data?.Surveys?.[0] ? data?.Surveys?.[0] : {}
  const {t} = useTranslation();
  let initialData = data;
  const [showToast, setShowToast] = useState(null);
  
  //sort survey questions based on qorder field, in surveyData.questions array, here and then render
  surveyData?.questions?.sort((a,b)=>a.qorder-b.qorder)
  const history = useHistory();

  useEffect(() => {
    if(data && initialData?.Surveys?.[0]?.hasResponded == true || initialData?.Surveys?.[0]?.hasResponded === "true")
      setShowToast({ key: true, label: "SURVEY_FORM_IS_ALREADY_SUBMITTED" });
    else if(data && initialData?.Surveys?.[0]?.status == "INACTIVE")
      setShowToast({ key: true, label: "SURVEY_FORM_IS_ALREADY_INACTIVE" });
  },[data?.Surveys?.[0]?.hasResponded,initialData?.Surveys?.[0]?.hasResponded])

  const onSubmit = (data) => {
    const details = {
      AnswerEntity: {
        surveyId: surveyData.uuid,
        answers: transformSurveyResponseData(data),
        surveyTitle:surveyData.title,
        hasResponded:surveyData.hasResponded,
      },
    };
    history.push("/digit-ui/citizen/engagement/surveys/submit-response", details);
  };

  if(Object.keys(surveyData)?.length > 0 || isLoading)
  return <CitizenSurveyForm surveyData={surveyData} isSubmitDisabled={showToast? true : false} isLoading={isLoading} onFormSubmit={onSubmit} formDisabled={showToast? true : false} showToast={showToast} />;
  else return <NoSurveyFoundPage t={t}/>
};

export default FillSurvey;
