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
    //console.log("<<<<<onSubmit>>>>>>", data);
    const details = {
      AnswerEntity: {
        surveyId: surveyData.uuid,
        answers: transformSurveyResponseData(data),
      },
    };
   // console.log("<<<<<onSubmit>>>>>>", details);
    history.push("/digit-ui/citizen/engagement/surveys/submit-response", details);
  };

  
  return <CitizenSurveyForm surveyData={surveyData} onFormSubmit={onSubmit} />;
};

export default FillSurvey;
