import React from "react";
import { useHistory } from "react-router-dom";
import CitizenSurveyForm from "../../../components/Surveys/CitizenSurveyForm";

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
  const surveyData = data?.Surveys?.[0]
  
  //sort survey questions based on qorder field, in surveyData.questions array, here and then render
  surveyData?.questions?.sort((a,b)=>a.qorder-b.qorder)
  const history = useHistory();

  const onSubmit = (data) => {
    const details = {
      AnswerEntity: {
        surveyId: surveyData.uuid,
        answers: transformSurveyResponseData(data),
        surveyTitle:surveyData.title,
        hasResponded:surveyData.hasResponded,
      },
    };
    history.push(`/${window?.contextPath}/citizen/engagement/surveys/submit-response`, details);
  };

  
  return <CitizenSurveyForm surveyData={surveyData} isLoading={isLoading} onFormSubmit={onSubmit} formDisabled={false} />;
};

export default FillSurvey;
