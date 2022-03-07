import React,{Fragment,useEffect,useMemo,useState} from 'react'
import { Card, CardLabelError, CheckBox, RadioButtons, TextArea, TextInput,Loader,CardHeader, BreakLine, CardLabel, CardSectionHeader } from "@egovernments/digit-ui-react-components";
import { bindQuesWithAns } from './bindquesansutil';
import WhoHasResponded from './WhoHasResponded';
import SurveyDetailsView from './SurveyDetailsView';
import { useTranslation } from "react-i18next";
import McqChart from './McqChart';
import CheckBoxChart from './CheckBoxChart';

const transformDate = (date) => {
    const split = date.split('-');
    const month = split[1];
    const year = split[0];
    const day = split[2];
    const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

    return (<p style={{"marginTop":"16px"}}>
        <strong>{`${monthNames[month-1]} ${year} ${day}`}</strong>
    </p>)
}


const getUserData = (data) => {
    const obj = {}
    data.map(ans => {
        obj[ans.mobileNumber]=ans.emailId
    })
    return obj;
}



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
                        // <div>
                        //     <CardSectionHeader>{ques.questionStatement}</CardSectionHeader>
                        //     <header style={{"fontWeight":"bold"}}>{`${resCount} Responses`}</header>
                        //     <Card style={{"backgroundColor":"#FAFAFA","margin":"0px"}}>
                        //     {ans.map(el=> <p>{el}<BreakLine /></p>)}
                        //     </Card>
                        // </div>
                        <div style={{"margin":"30px"}}>
                            <CardSectionHeader>{ques.questionStatement}</CardSectionHeader>
                            <header style={{"fontWeight":"bold"}}>{`${resCount} Responses`}</header>
                            <div className='responses-container'>
                            {ans.map(el=> <div className='response-result'>{el}<BreakLine style={{"marginTop":"10px"}} /></div>)}
                            </div>
                            
                        </div>
                        )
            case "Date":
                return (
                        // <div className="surveyQuestion-wrapper">
                        //     <span className="question-title">{ques.questionStatement}</span>
                        //     <span className='text-3xl font-bold'>{`${resCount} Responses`}</span>
                        //     {ans.map(el=> <span>{el}</span>)}
                        // </div>

                        <div style={{"margin":"30px"}}>
                            <CardSectionHeader>{ques.questionStatement}</CardSectionHeader>
                            <header style={{"fontWeight":"bold"}}>{`${resCount} Responses`}</header>
                            <div className="responses-container-date">
                            {ans.map(el=> <div>{transformDate(el)}</div>)}
                            </div>
                        </div>
                        )
            case "Paragraph":
                return (
                        // <div className="surveyQuestion-wrapper">
                        //     <span className="question-title">{ques.questionStatement}</span>
                        //     <span className='text-3xl font-bold'>{`${resCount} Responses`}</span>
                        //     {ans.map(el=> <span>{el}</span>)}
                        // </div>
                        <div style={{"margin":"30px"}}>
                            <CardSectionHeader>{ques.questionStatement}</CardSectionHeader>
                            <header style={{"fontWeight":"bold"}}>{`${resCount} Responses`}</header>
                            <div className='responses-container'>
                            {ans.map(el=> <div className='response-result'>{el}<BreakLine style={{"marginTop":"10px"}} /></div>)}
                            </div>
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
                        <div style={{"margin":"30px"}}>
                            <CardSectionHeader>{ques.questionStatement}</CardSectionHeader>
                            <header style={{"fontWeight":"bold"}}>{`${resCount} Responses`}</header>
                            {/* {ans.map(el=> <p>{el}<BreakLine /></p>)} */}
                            <div className='responses-container' style={{"padding":"30px"}}>
                            <CheckBoxChart data={ques}/>
                            </div>
                            
                        </div>
                        )
            case "Multiple Choice":
                return (
                        <div style={{"margin":"30px"}}>
                            <CardSectionHeader>{ques.questionStatement}</CardSectionHeader>
                            <header style={{"fontWeight":"bold"}}>{`${resCount} Responses`}</header>
                            {/* {ans.map(el=> <p>{el}<BreakLine /></p>)} */}
                            <div className='responses-container'>
                            <McqChart data={ques}/>
                            </div>
                            
                        </div>
                        
                        )
            case "Time":
                return (
                        // <div className="surveyQuestion-wrapper">
                        //     <span className="question-title">{ques.questionStatement}</span>
                        //     <span className='text-3xl font-bold'>{`${resCount} Responses`}</span>
                        //     {ans.map(el=> <span>{el}</span>)}
                        // </div>
                        <div style={{"margin":"30px"}}>
                            <CardSectionHeader>{ques.questionStatement}</CardSectionHeader>
                           <header style={{"fontWeight":"bold"}}>{`${resCount} Responses`}</header>
                            <div className='responses-container-date'>
                            {ans.map(el=> <div style={{"marginTop":"16px"}}><strong>{el}</strong></div>)}
                            </div>
                        </div>
                        )
            
        }
    }

const SurveyResultsView = ({surveyInfo,responsesInfoMutation}) => {
    const { t } = useTranslation();
    // console.log("surveyInfo",surveyInfo);
    // console.log("responsesInfo",responsesInfoMutation.data);
    const [data,setData]=useState(null);
    const [userInfo,setUserInfo] = useState(null)
    useEffect(() => {
        if(responsesInfoMutation.isSuccess){
        const dp = bindQuesWithAns(surveyInfo?.questions,responsesInfoMutation.data.answers)
        setData(dp)
        const ue = getUserData(responsesInfoMutation.data.answers)
        setUserInfo(ue);
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
        <div style={{"margin":"30px"}}>
        <SurveyDetailsView surveyTitle={surveyInfo.title} surveyDesc={surveyInfo.description} t={t} />
        </div>
        <WhoHasResponded t={t} userInfo={userInfo}/>
        {data.map(element =>( 
            displayResult(element,element.answers,element.type,element.answers.length)
        ))}
    </Card>
  )
}

export default SurveyResultsView