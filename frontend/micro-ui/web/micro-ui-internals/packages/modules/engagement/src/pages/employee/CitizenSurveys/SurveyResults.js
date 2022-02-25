import React,{ useEffect } from 'react'
import { useHistory, useParams } from "react-router-dom";
import CitizenSurveyForm from "../../../components/Surveys/CitizenSurveyForm";
import { useQueryClient } from "react-query";
import { ActionBar, Card, SubmitBar, Menu,Loader } from "@egovernments/digit-ui-react-components";

const SurveyResults = () => {
   
    const surveyData = location?.state;
    const params = useParams();
    //console.log(surveyData);
    // const tenantIds = Digit.SessionStorage.get("CITIZEN.COMMON.HOME.CITY")?.code;
    const mutation = Digit.Hooks.survey.useShowResults()

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

 // console.log(mutation.data);

   if (mutation.isLoading && !mutation.isIdle) {
    return <Loader />;
  }
  
    if(mutation.isSuccess) return <div>Data fetched successfully</div>
    if(mutation.isError) return <div>An error occured...</div>
   
   
    // return <CitizenSurveyForm surveyData={surveyData} submitDisabled={true} formdisabled={true} formDefaultValues={{}} />

    return <div>Hello World</div>

}

export default SurveyResults