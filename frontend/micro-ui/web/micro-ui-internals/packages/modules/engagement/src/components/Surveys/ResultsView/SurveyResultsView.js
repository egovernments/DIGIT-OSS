import React,{Fragment,useEffect,useMemo,useState} from 'react'
import { Card, CardLabelError, CheckBox, RadioButtons, TextArea, TextInput,Loader,CardHeader } from "@egovernments/digit-ui-react-components";
import { bindQuesWithAns } from './bindquesansutil';
import WhoHasResponded from './WhoHasResponded';
import SurveyDetailsView from './SurveyDetailsView';
import { useTranslation } from "react-i18next";

const displayResult = (quesStmt,ans,type,resCount) => {
        switch(type) {
            case "Short Answer":
                 return (
                     
                        <div className="surveyQuestion-wrapper">
                            <span className="question-title">{quesStmt}</span>
                            <span className='text-3xl font-bold'>{`${resCount} Responses`}</span>
                            {ans.map(el=> <span>{el}</span>)}
                        </div>
                    
                        )
            case "Date":
                return (
                        <div className="surveyQuestion-wrapper">
                            <span className="question-title">{quesStmt}</span>
                            <span className='text-3xl font-bold'>{`${resCount} Responses`}</span>
                            {ans.map(el=> <span>{el}</span>)}
                        </div>
                        )
            case "Paragraph":
                return (
                        <div className="surveyQuestion-wrapper">
                            <span className="question-title">{quesStmt}</span>
                            <span className='text-3xl font-bold'>{`${resCount} Responses`}</span>
                            {ans.map(el=> <span>{el}</span>)}
                        </div>
                        )
            case "Check Boxes":
                return (
                        <div className="surveyQuestion-wrapper">
                            <span className="question-title">{quesStmt}</span>
                            <span className='text-3xl font-bold'>{`${resCount} Responses`}</span>
                            {ans.map(el=> <span>{el}</span>)}
                        </div>
                        )
            case "Multiple Choice":
                return (
                        <div className="surveyQuestion-wrapper">
                            <span className="question-title">{quesStmt}</span>
                            <span className='text-3xl font-bold'>{`${resCount} Responses`}</span>
                            {ans.map(el=> <span>{el}</span>)}
                        </div>
                        )
            case "Time":
                return (
                        <div className="surveyQuestion-wrapper">
                            <span className="question-title">{quesStmt}</span>
                            <span className='text-3xl font-bold'>{`${resCount} Responses`}</span>
                            {ans.map(el=> <span>{el}</span>)}
                        </div>
                        )
            
        }
    }

const SurveyResultsView = ({surveyInfo,responsesInfoMutation}) => {
    const { t } = useTranslation();
    console.log("surveyInfo",surveyInfo);
    console.log("responsesInfo",responsesInfoMutation.data);
    const [data,setData]=useState(null);
    useEffect(() => {
        if(responsesInfoMutation.isSuccess){
        const dp = bindQuesWithAns(surveyInfo?.questions,responsesInfoMutation.data.answers)
        setData(dp)
        }
    },[responsesInfoMutation])

    //    const dp = bindQuesWithAns(surveyInfo?.questions,responsesInfoMutation.data.answers);
    //    setData(dp)    
    
    if(!data) return <Loader />
    
    return (
    <Card>
        <CardHeader>Surveys</CardHeader>
        {/* display survey detail form
        display whoHasResponded component */}
        <SurveyDetailsView surveyTitle={surveyInfo.title} surveyDesc={surveyInfo.description} t={t} />
        <WhoHasResponded t={t}/>
        {data.map(element =>( 
            displayResult(element.questionStatement,element.answers,element.type,element.answers.length)
        ))}
    </Card>
  )
}

export default SurveyResultsView