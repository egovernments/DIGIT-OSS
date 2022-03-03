import React,{Fragment,useEffect,useMemo,useState} from 'react'
import { Card, CardLabelError, CheckBox, RadioButtons, TextArea, TextInput,Loader,CardHeader, BreakLine, CardLabel, CardSectionHeader } from "@egovernments/digit-ui-react-components";
import { bindQuesWithAns } from './bindquesansutil';
import WhoHasResponded from './WhoHasResponded';
import SurveyDetailsView from './SurveyDetailsView';
import { useTranslation } from "react-i18next";
import McqChart from './McqChart';
import CheckBoxChart from './CheckBoxChart';

//static for now
const userData = [
    {
        email:"abc@gmail.com",
        phone:9912555933
    },

{
        email:"abc@gmail.com",
        phone:9912555933
    },
    {
        email:"abc@gmail.com",
        phone:9912555933
    },
    {
        email:"abc@gmail.com",
        phone:9912555933
    },
]


const displayResult = (ques,ans,type,resCount) => {
        switch(type) {
            case "Short Answer":
                 return (
                        // <div className="surveyQuestion-wrapper">
                        //     <span className="question-title">{quesStmt}</span>
                        //     <header className=''>{`${resCount} Responses`}</header>
                        //     <Card style={{"backgroundColor":"#FAFAFA","margin":"0px"}}>
                        //     {ans.map(el=> <span>{el}<BreakLine /></span>)}
                        //     </Card>
                        // </div>
                        <div>
                            <CardSectionHeader>{ques.questionStatement}</CardSectionHeader>
                            <header style={{"fontWeight":"bold"}}>{`${resCount} Responses`}</header>
                            <Card style={{"backgroundColor":"#FAFAFA","margin":"0px"}}>
                            {ans.map(el=> <p>{el}<BreakLine /></p>)}
                            </Card>
                        </div>
                        )
            case "Date":
                return (
                        // <div className="surveyQuestion-wrapper">
                        //     <span className="question-title">{ques.questionStatement}</span>
                        //     <span className='text-3xl font-bold'>{`${resCount} Responses`}</span>
                        //     {ans.map(el=> <span>{el}</span>)}
                        // </div>
                        <div>
                            <CardSectionHeader>{ques.questionStatement}</CardSectionHeader>
                            <header style={{"fontWeight":"bold"}}>{`${resCount} Responses`}</header>
                            <Card style={{"backgroundColor":"#FAFAFA","margin":"0px"}}>
                            {ans.map(el=> <p>{el}<BreakLine /></p>)}
                            </Card>
                        </div>
                        )
            case "Paragraph":
                return (
                        // <div className="surveyQuestion-wrapper">
                        //     <span className="question-title">{ques.questionStatement}</span>
                        //     <span className='text-3xl font-bold'>{`${resCount} Responses`}</span>
                        //     {ans.map(el=> <span>{el}</span>)}
                        // </div>
                        <div>
                            <CardSectionHeader>{ques.questionStatement}</CardSectionHeader>
                            <header style={{"fontWeight":"bold"}}>{`${resCount} Responses`}</header>
                            <Card style={{"backgroundColor":"#FAFAFA","margin":"0px"}}>
                            {ans.map(el=> <p>{el}<BreakLine /></p>)}
                            </Card>
                        </div>
                        )
            case "Check Boxes":
                return (
                        // <div className="surveyQuestion-wrapper">
                        //     <span className="question-title">{ques.questionStatement}</span>
                        //     <span className='text-3xl font-bold'>{`${resCount} Responses`}</span>
                        //     {ans.map(el=> <span>{el}</span>)}
                        // </div>
                        // <div>
                        //     <CardSectionHeader>{ques.questionStatement}</CardSectionHeader>
                        //     <header style={{"fontWeight":"bold"}}>{`${resCount} Responses`}</header>
                        //     <Card style={{"backgroundColor":"#FAFAFA","margin":"0px"}}>
                        //     {ans.map(el=> <p>{el}<BreakLine /></p>)}
                        //     </Card>
                        // </div>
                        <div>
                            <CardSectionHeader>{ques.questionStatement}</CardSectionHeader>
                            <header style={{"fontWeight":"bold"}}>{`${resCount} Responses`}</header>
                            <Card style={{"backgroundColor":"#FAFAFA","margin":"0px"}}>
                            {/* {ans.map(el=> <p>{el}<BreakLine /></p>)} */}
                            <CheckBoxChart data={ques}/>
                            </Card>
                        </div>
                        )
            case "Multiple Choice":
                return (
                        <div>
                            <CardSectionHeader>{ques.questionStatement}</CardSectionHeader>
                            <header style={{"fontWeight":"bold"}}>{`${resCount} Responses`}</header>
                            <Card style={{"backgroundColor":"#FAFAFA","margin":"0px"}}>
                            {/* {ans.map(el=> <p>{el}<BreakLine /></p>)} */}
                            <McqChart data={ques}/>
                            </Card>
                        </div>
                        
                        )
            case "Time":
                return (
                        // <div className="surveyQuestion-wrapper">
                        //     <span className="question-title">{ques.questionStatement}</span>
                        //     <span className='text-3xl font-bold'>{`${resCount} Responses`}</span>
                        //     {ans.map(el=> <span>{el}</span>)}
                        // </div>
                        <div>
                            <CardSectionHeader>{ques.questionStatement}</CardSectionHeader>
                           <header style={{"fontWeight":"bold"}}>{`${resCount} Responses`}</header>
                            <Card style={{"backgroundColor":"#FAFAFA","margin":"0px"}}>
                            {ans.map(el=> <p>{el}<BreakLine /></p>)}
                            </Card>
                        </div>
                        )
            
        }
    }

const SurveyResultsView = ({surveyInfo,responsesInfoMutation}) => {
    const { t } = useTranslation();
    // console.log("surveyInfo",surveyInfo);
    // console.log("responsesInfo",responsesInfoMutation.data);
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
        <WhoHasResponded t={t} userInfo={userData}/>
        {data.map(element =>( 
            displayResult(element,element.answers,element.type,element.answers.length)
        ))}
    </Card>
  )
}

export default SurveyResultsView