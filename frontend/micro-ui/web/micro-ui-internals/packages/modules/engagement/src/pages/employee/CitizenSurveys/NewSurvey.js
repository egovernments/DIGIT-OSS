import { CloseSvg, FormComposer, Header } from "@egovernments/digit-ui-react-components";
import React, { Fragment, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import CreateNewSurvey from "../../../components/Surveys/SurveyForms";

export const answerTypeEnum = {
  "Short Answer": "SHORT_ANSWER_TYPE",
  Paragraph: "LONG_ANSWER_TYPE",
  "Multiple Choice": "MULTIPLE_ANSWER_TYPE",
  "Check Boxes": "CHECKBOX_ANSWER_TYPE",
  Date: "DATE_ANSWER_TYPE",
  Time: "TIME_ANSWER_TYPE",
};


/**TODO NRJ-egov handle this by setting correct state inside the surveyFormMaker */
export const mapQuestions = (questions =[]) =>{
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
  return questions.map(({formConfig},index)=>{
      const {options:choices, questionStatement,required, type:stringType} = formConfig;

      const finalQuestion = {questionStatement, required, type:answerTypeEnum[stringType.title]};
      if(stringType?.title === "Multiple Choice" || stringType?.title ==="Check Boxes") {
        finalQuestion["options"] = choices;
      }
      return finalQuestion;
    })
}

const NewSurveys = () => {
  const { t } = useTranslation();
  const history = useHistory();
  
  const onSubmit = (data) => {
    const { collectCitizenInfo, title, description, tenantIds, fromDate, toDate, fromTime, toTime, questions } = data;
    const mappedQuestions = mapQuestions(questions);
    const details = {
      SurveyEntity: {
        tenantIds: tenantIds.map(({code})=>(code)),
        title,
        description,
        collectCitizenInfo: collectCitizenInfo.code,
        startDate: new Date(`${fromDate} ${fromTime}`).getTime(),
        endDate: new Date(`${toDate} ${toTime}`).getTime(),
        questions:mappedQuestions
      },
    };
    history.push(`/${window?.contextPath}/employee/engagement/surveys/create-response`, details)
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
    collectCitizenInfo: "",
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
    </Fragment>
  );
};

export default NewSurveys;
