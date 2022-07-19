import React,{Fragment,useEffect,useMemo,useState} from 'react'
import { Card, CardLabelError, CheckBox, RadioButtons, TextArea, TextInput, Loader, CardHeader, BreakLine, CardLabel, CardSectionHeader, Header, MultiLink } from "@egovernments/digit-ui-react-components";
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
    return {
        day,
        date:`${monthNames[month-1]} ${year}`
    }
    // return (<p>
    //     <strong>{`${monthNames[month-1]} ${year} ${day}`}</strong>
    // </p>)
}

function transformTime (time) {
  // Check correct time format and split into components
  time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

  if (time.length > 1) { // If time format correct
    time = time.slice (1);  // Remove full string match value
    time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join (''); // return adjusted time or original string
}

const getUserData = (data) => {
    const obj = {}
    data?.map(ans => {
        obj[ans.mobileNumber]=ans.emailId
    })
    return obj;
}



const displayResult = (ques,ans,type,resCount=0) => {
        switch(type) {
            case "Short Answer":
                 return (
                        // <div className="surveyQuestion-wrapper">
                        //     <span className="question-title">{quesStmt}</span>
                        //     <header className=''>{`${resCount} Responses`}</header>
                        //     <Card style={{"backgroundColor":"#FAFAFA","margin":"0px"}}>
                        //     {ans?.map(el=> <span>{el}<BreakLine /></span>)}
                        //     </Card>
                        // </div>
                        // <div>
                        //     <CardSectionHeader>{ques.questionStatement}</CardSectionHeader>
                        //     <header style={{"fontWeight":"bold"}}>{`${resCount} Responses`}</header>
                        //     <Card style={{"backgroundColor":"#FAFAFA","margin":"0px"}}>
                        //     {ans?.map(el=> <p>{el}<BreakLine /></p>)}
                        //     </Card>
                        // </div>
                        <div style={{"margin":"30px"}}>
                            <CardSectionHeader>{ques.questionStatement}</CardSectionHeader>
                            <header style={{"fontWeight":"bold"}}>{`${resCount} Responses`}</header>
                            <div className='responses-container'>
                            {ans?.map(el=> <div className='response-result responses-container-line'>{el}<BreakLine style={{"marginTop":"10px"}} /></div>)}
                            </div>
                            
                        </div>
                        )
            case "Date":
                return (
                        
                        <div style={{"margin":"30px"}}>
                            <CardSectionHeader>{ques.questionStatement}</CardSectionHeader>
                            <header style={{"fontWeight":"bold"}}>{`${resCount} Responses`}</header>
                            {/* <div className="responses-container-date">
                            {ans?.map(el=> <div className='date-time'>{transformDate(el).date}</div>)}
                            </div> */}
                            <div className='date-container'>
                                {ans?.map(el => (<div className='date-response'>
                                    <div>
                                    {transformDate(el).date}
                                    </div>
                                    <div className='divide'></div>
                                    <div>
                                    {transformDate(el).day}
                                    </div>
                                </div>))}
                            </div>
                        </div>
                        )
            case "Time":
                return (
                        <div style={{"margin":"30px"}}>
                            <CardSectionHeader>{ques.questionStatement}</CardSectionHeader>
                           <header style={{"fontWeight":"bold"}}>{`${resCount} Responses`}</header>
                            {/* <div className='responses-container-date'>
                            {ans?.map(el=> <div className='date-time'><strong>{el}</strong></div>)}
                            </div> */}
                            <div className='date-container'>
                                {ans?.map(el => (<div className='date-response'>
                                    <div>
                                    {el}
                                    </div>
                                    <div className='divide'></div>
                                    <div>
                                    {transformTime(el)}
                                    </div>
                                </div>))}
                            </div>
                        </div>
                        )
            
            case "Paragraph":
                return (
                        // <div className="surveyQuestion-wrapper">
                        //     <span className="question-title">{ques.questionStatement}</span>
                        //     <span className='text-3xl font-bold'>{`${resCount} Responses`}</span>
                        //     {ans?.map(el=> <span>{el}</span>)}
                        // </div>
                        <div style={{"margin":"30px"}}>
                            <CardSectionHeader>{ques.questionStatement}</CardSectionHeader>
                            <header style={{"fontWeight":"bold"}}>{`${resCount} Responses`}</header>
                            <div className='responses-container'>
                            {ans?.map(el=> <div className='response-result responses-container-line'>{el}<BreakLine style={{"marginTop":"10px"}} /></div>)}
                            </div>
                        </div>
                        )
            case "Check Boxes":
                return (
                        // <div className="surveyQuestion-wrapper">
                        //     <span className="question-title">{ques.questionStatement}</span>
                        //     <span className='text-3xl font-bold'>{`${resCount} Responses`}</span>
                        //     {ans?.map(el=> <span>{el}</span>)}
                        // </div>
                        // <div>
                        //     <CardSectionHeader>{ques.questionStatement}</CardSectionHeader>
                        //     <header style={{"fontWeight":"bold"}}>{`${resCount} Responses`}</header>
                        //     <Card style={{"backgroundColor":"#FAFAFA","margin":"0px"}}>
                        //     {ans?.map(el=> <p>{el}<BreakLine /></p>)}
                        //     </Card>
                        // </div>
                        <div style={{"margin":"30px"}}>
                            <CardSectionHeader>{ques.questionStatement}</CardSectionHeader>
                            <header style={{"fontWeight":"bold"}}>{`${resCount} Responses`}</header>
                            {/* {ans?.map(el=> <p>{el}<BreakLine /></p>)} */}
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
                            {/* {ans?.map(el=> <p>{el}<BreakLine /></p>)} */}
                            <div className='responses-container' style={{overflow:"-moz-hidden-unscrollable"}}>
                            <McqChart data={ques}/>
                            </div>
                            
                        </div>
                        
                        )
            
        }
    }

const SurveyResultsView = ({surveyInfo,responsesInfoMutation}) => {
    
    const { t } = useTranslation();
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
    
    
    const generateExcelObj = (ques,ans) => {

        const countResponses = parseInt(ans.length/ques.length)
        const dp = bindQuesWithAns(surveyInfo?.questions, responsesInfoMutation.data.answers)
        
        const result = []
        //now in a loop fill all the sampleObj (3 times) and use it to download report
        for(let i=0;i<countResponses;i++){
            //fill the sampleObj using dp and push into result
            
            const sampleObj = {
                "TimeStamp": ""
            }
            ques?.map(q => {
                sampleObj[q.questionStatement] = ""
            })

            const qStatements = ques?.map(q=>q.questionStatement) 
            qStatements?.map(qs=>{
                const filteredElement = dp?.filter(element => element?.questionStatement === qs)
                const ansToStore = typeof filteredElement?.[0]?.answers?.[i] === "object" ? (filteredElement?.[0]?.answers?.[i]?.join()?.includes("ul") ? "NA" : filteredElement?.[0]?.answers?.[i]?.join()) : (filteredElement?.[0]?.answers?.[i] === "ul" ? "NA" : (filteredElement?.[0]?.answers?.[i] === "" ? "NA" : filteredElement?.[0]?.answers?.[i]))
                sampleObj[qs] = ansToStore
                sampleObj["TimeStamp"] = filteredElement?.[0]?.timeStamp
            })
            
            result.push(sampleObj)
        }
        return result
        
        
        
    }

    const handleReportDownload = () => {
        const result = generateExcelObj(surveyInfo?.questions, responsesInfoMutation.data.answers)
        return Digit.Download.Excel(result, responsesInfoMutation.data.title);
    }

    if(!data) return <Loader />
    
    return (
    <div className="custom-group-merge-container">
        <Header>{t("CS_COMMON_SURVEYS")}</Header>
        <MultiLink
                style={{marginTop:"-45px"}}
                onHeadClick={() => handleReportDownload()}
                downloadBtnClassName={"employee-download-btn-className"}
                label={t("SURVEY_REPORT")}
        />
        <Card >
            {/* display survey detail form
            display whoHasResponded component */}
            <div style={{"margin":"30px"}}>
            <SurveyDetailsView surveyTitle={surveyInfo.title} surveyDesc={surveyInfo.description} t={t} surveyId={surveyInfo.uuid} />
            </div>
            <WhoHasResponded t={t} userInfo={userInfo}/>
            {data?.map(element =>( 
                displayResult(element,element?.answers,element?.type,element?.answers?.length)
            ))}
        </Card>
    </div>
  )
}

export default SurveyResultsView