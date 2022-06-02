import React,{ useEffect,useState } from 'react'
import { useHistory, useParams } from "react-router-dom";
import CitizenSurveyForm from "../../../components/Surveys/CitizenSurveyForm";
import { useQueryClient } from "react-query";
import { ActionBar, Card, SubmitBar, Menu,Loader } from "@egovernments/digit-ui-react-components";
import { format } from "date-fns";
import SurveyResultsView from '../../../components/Surveys/ResultsView/SurveyResultsView';


const TypeAnswerEnum = {
  SHORT_ANSWER_TYPE: "Short Answer",
  LONG_ANSWER_TYPE: "Paragraph",
  MULTIPLE_ANSWER_TYPE: "Multiple Choice",
  CHECKBOX_ANSWER_TYPE: "Check Boxes",
  DATE_ANSWER_TYPE: "Date",
  TIME_ANSWER_TYPE: "Time",
};

const SurveyResults = () => {
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const params = useParams();
    const mutation = Digit.Hooks.survey.useShowResults();
    const queryClient = useQueryClient();
    useEffect(() => {
        const onSuccess = () => {
        queryClient.clear();
        };
        mutation.mutate({
        surveyId:params.id
        }, {
        onSuccess,
        });
    }, []);
    
    const { isLoading, data: surveyData } = Digit.Hooks.survey.useSearch(
    { tenantIds: tenantId, uuid: params.id },
    {
      select: (data) => {
        const surveyObj = data?.Surveys?.[0];
        return {
          //tenantIds: { code: surveyObj.tenantId },
          uuid: surveyObj.uuid,
          title: surveyObj.title,
          description: surveyObj.description,
          collectCitizenInfo: { code: surveyObj.collectCitizenInfo },
          fromDate: format(new Date(surveyObj.startDate), "yyyy-MM-dd"),
          toDate: format(new Date(surveyObj.endDate), "yyyy-MM-dd"),
          fromTime: format(new Date(surveyObj.startDate), "hh:mm"),
          toTime: format(new Date(surveyObj.endDate), "hh:mm"),
          questions: surveyObj.questions.map(({ questionStatement, type, required, options, uuid, surveyId }) => ({
            questionStatement,
            type: TypeAnswerEnum[type],
            required,
            options,
            uuid,
            surveyId
          })),
          status: surveyObj.status,
          answersCount:surveyObj.answersCount,
        };
      },
    }
  );

    if(isLoading) return <Loader />
    
    // else if(mutation.isLoading) return <Loader />
    // //if(mutation.isError) return <div>An error occured...</div>
    
    return <SurveyResultsView surveyInfo={surveyData} responsesInfoMutation={mutation} />
    
}

export default SurveyResults

