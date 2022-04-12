import { Loader } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useQueryClient } from "react-query";
import CitizenSurveyForm from "../../../components/Surveys/CitizenSurveyForm";

const ShowSurvey = ({ location }) => {
  const surveyData = location?.state;
  const questions = surveyData?.questions;
  const tenantIds = Digit.ULBService.getCitizenCurrentTenant();
  const mutation = Digit.Hooks.survey.useShowResults();

  const queryClient = useQueryClient();

  useEffect(() => {
    const onSuccess = () => {
      queryClient.clear();
    };
    mutation.mutate(
      {
        surveyId: surveyData.uuid,
      },
      {
        onSuccess,
      }
    );
  }, []);

  if (mutation.isLoading && !mutation.isIdle) {
    return <Loader />;
  }

  if (mutation.isError) return <div>An error occured...</div>;

  //questionid in answers uuid in surveys needs to be matched
  const answers = mutation?.data?.answers;
  const formDefaultValues = {};
  answers?.map((ans) => {
    if (ans?.answer.length === 1) formDefaultValues[ans?.questionId] = ans?.answer[0];
    else formDefaultValues[ans?.questionId] = ans?.answer;
  });

  //pass this formDefaultValues in this format.....questionUuid:answerText for all the questions that are in the particular survey
  //"44a54cdb-7e8a-4631-b261-600f1f2cf5a6":"answerText",
  // const formDefaultValues = {}
  // questions.map(ques => {
  //   if(ques.type==="SHORT_ANSWER_TYPE" || ques.type==="LONG_ANSWER_TYPE"){
  //     formDefaultValues[ques.uuid]="answerText"
  //   }
  // })

  return <CitizenSurveyForm surveyData={surveyData} submitDisabled={true} formDisabled={true} formDefaultValues={formDefaultValues} />;
};

export default ShowSurvey;
