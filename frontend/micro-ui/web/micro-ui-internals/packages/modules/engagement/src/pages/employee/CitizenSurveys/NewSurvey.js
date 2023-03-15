import { CloseSvg, FormComposer, Header, Toast } from "@egovernments/digit-ui-react-components";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import CreateNewSurvey from "../../../components/Surveys/SurveyForms";

export const answerTypeEnum = {
  "Short Answer": "SHORT_ANSWER_TYPE",
  "Short answer": "SHORT_ANSWER_TYPE",
  Paragraph: "LONG_ANSWER_TYPE",
  "Multiple Choice": "MULTIPLE_ANSWER_TYPE",
  "Check Boxes": "CHECKBOX_ANSWER_TYPE",
  Date: "DATE_ANSWER_TYPE",
  Time: "TIME_ANSWER_TYPE",
};


/**TODO NRJ-egov handle this by setting correct state inside the surveyFormMaker */
export const mapQuestions = (questions =[],initialData) =>{
  //Added this condition to avoid a bug in which the question type is set as undefined when question type dropdown is not touched and create survey form is submitted. 
  questions = questions.map(ques=>{
    if(!ques?.formConfig?.type){
      return {
        ...ques,
        formConfig: { ...ques?.formConfig, type:"Short Answer"}
      }
    }
    return ques
  })
  if(!questions.length) return;
  let newmappedQues = [];
  newmappedQues =  questions.map(({formConfig},index)=>{
      const {options:choices, questionStatement,required, type:stringType, uuid, qorder} = formConfig;
      const finalQuestion = {questionStatement,uuid : uuid ? uuid : null, qorder, status : "ACTIVE", required, type: typeof stringType === "object" && stringType !== null ? stringType.value : (stringType.title ?  answerTypeEnum[stringType.title] : answerTypeEnum[stringType])};
      if((stringType?.title === "Multiple Choice" || stringType?.value === "MULTIPLE_ANSWER_TYPE") || (stringType?.title ==="Check Boxes" || stringType?.value === "CHECKBOX_ANSWER_TYPE")) {
        finalQuestion["options"] = choices;
      }
      return finalQuestion;
    })
  
  initialData && initialData?.questions?.map((ques) => {
    let found = newmappedQues.length > 0 ? newmappedQues.some(el => el.uuid === ques?.uuid) : false;
    if(!found) newmappedQues.push({...ques,status:"INACTIVE"});
  })

  return newmappedQues;
 
}

const NewSurveys = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [showToast, setShowToast] = useState(null);

  const closeToast = () => {
    setShowToast(null);
  };
  setTimeout(() => {
    closeToast();
  }, 10000);
  
  const onSubmit = (data) => {
    const { collectCitizenInfo, title, description, tenantIds, fromDate, toDate, fromTime, toTime, questions } = data;
    const mappedQuestions = mapQuestions(questions);
    const details = {
      SurveyEntity: {
        tenantIds: tenantIds.map(({code})=>(code)),
        title,
        description,
        startDate: new Date(`${fromDate} ${fromTime}`).getTime(),
        endDate: new Date(`${toDate} ${toTime}`).getTime(),
        questions:mappedQuestions
      },
    };
    
    try{
      let filters = {tenantIds : tenantIds?.[0]?.code, title : title}
      Digit.Surveys.search(filters).then((ob) => {
        if(ob?.Surveys?.length>0)
        {
          setShowToast({ key: true, label: "SURVEY_SAME_NAME_SURVEY_ALREADY_PRESENT" });
        }
        else
        {
          history.push("/digit-ui/employee/engagement/surveys/create-response", details)
        }
      })
    }
    catch(error)
    {}
  };

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const ulbs = Digit.SessionStorage.get("ENGAGEMENT_TENANTS");
  const userInfo = Digit.UserService.getUser().info;
  const userUlbs = ulbs
    .filter((ulb) => userInfo?.roles?.some((role) => role?.tenantId === ulb?.code))
    
 
  const defaultValues = {
    fromDate: "",
    fromTime: "",
    toDate: "",
    toTime: "",
    questions: {},
    // tenantIds:[]
    tenantIds:userUlbs,
  };

  const stylesForForm = {
    marginLeft:'-20px',
  }
  
  return (
    <Fragment>
      {/* <Header>{t("CS_COMMON_SURVEYS")}</Header> */}
      <Header>{t("CREATE_NEW_SURVEY")}</Header>
      <div style={stylesForForm}>
        <CreateNewSurvey t={t} onSubmit={onSubmit} initialFormValues={defaultValues} />
      </div>
      {showToast && <Toast error={showToast.key} label={t(showToast.label)} onClose={closeToast} />}
    </Fragment>
  );
};

export default NewSurveys;
