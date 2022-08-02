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
  const surveyData = location?.state;
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
    history.push("/digit-ui/citizen/engagement/surveys/submit-response", details);
  };

  
  return <CitizenSurveyForm surveyData={surveyData} onFormSubmit={onSubmit} formDisabled={false} />;
};

export default FillSurvey;
