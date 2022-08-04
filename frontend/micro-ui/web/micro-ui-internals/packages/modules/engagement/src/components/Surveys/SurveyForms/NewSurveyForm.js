import { DatePicker, Dropdown, CheckBox, TextArea, TextInput, CardLabelError } from "@egovernments/digit-ui-react-components";
import { DustbinIcon } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import TimePicker from "react-time-picker";
import Checkboxes from "./AnswerTypes/Checkboxes";
import MultipleChoice from "./AnswerTypes/MultipleChoice";

const answerTypeEnum = {
  "Short Answer": "SHORT_ANSWER_TYPE",
  Paragraph: "LONG_ANSWER_TYPE",
  "Multiple Choice": "MULTIPLE_ANSWER_TYPE",
  "Check Boxes": "CHECKBOX_ANSWER_TYPE",
  Date: "DATE_ANSWER_TYPE",
  Time: "TIME_ANSWER_TYPE",
};


const NewSurveyForm = ({ t, index, questionStatement, type, required, options, disableInputs, dispatch, isPartiallyEnabled, addOption, formDisabled, controlSurveyForm }) => {
  
  const dropdownOptions = [
    {
      title: t("Surveys_Short_Answer"),
      value: "SHORT_ANSWER_TYPE",
    },
    {
      title: t("Surveys_Multiple_Choice"),
      value: "MULTIPLE_ANSWER_TYPE",
    },
    {
      title: t("Surveys_Check_Boxes"),
      value: "CHECKBOX_ANSWER_TYPE",
    },
    {
      title: t("Surveys_Paragraph"),
      value: "LONG_ANSWER_TYPE",
    },
    {
      title: t("Surveys_Date"),
      value: "DATE_ANSWER_TYPE",
    },
    {
      title: t("Surveys_Time"),
      value: "TIME_ANSWER_TYPE",
    },
  ];


  const selectedType = dropdownOptions.filter(option => option?.title === type) 
  
  const [surveyQuestionConfig, setSurveyQuestionConfig] = useState({
    questionStatement, type: type ? selectedType?.[0]  : {
      title: "Short Answer",
      value: "SHORT_ANSWER_TYPE",
    }, required, options:options?.length>0?options:["option 1"] });
  const { register, formState  } = useFormContext();

  const handleAddOption = () =>
    setSurveyQuestionConfig((prevState) => {
      const updatedState = { ...prevState };
      updatedState.options.push(`option ${updatedState.options.length + 1}`);
      return updatedState;
    });
  const handleUpdateOption = ({ value, id }) => {
    setSurveyQuestionConfig((prevState) => {
      const updatedState = { ...prevState };
      updatedState.options.splice(id, 1, value);
      return updatedState;
    });
  };
  const handleRemoveOption = (id) => {
    if (surveyQuestionConfig.options.length === 1) return;
    setSurveyQuestionConfig((prevState) => {
      const updatedState = { ...prevState };
      updatedState.options.splice(id, 1);
      return updatedState;
    });
  };

  useEffect(() => {
    dispatch({ type: "updateForm", payload: { index: index, formConfig: surveyQuestionConfig } });
  }, [surveyQuestionConfig]);

  const renderAnswerComponent = (type) => {
    switch (type?.title) {
      case "Paragraph":
        return <div>
          <TextArea 
            placeholder="LONG ANSWER"
            name={"longAnsDescription"}
            inputRef={register({
              maxLength: {
                value: 500,
                message: t("EXCEEDS_500_CHAR_LIMIT"),
              }
            })}
              />
          {formState?.errors && <CardLabelError>{formState?.errors?.longAnsDescription?.message}</CardLabelError>}
              </div>;
      case "Date":
        return <DatePicker stylesForInput={{ width: "calc(100% - 290px)" }} style={{width:"202px"}}/>;
      case "Time":
        return <TextInput type="time" textInputStyle={{width:"202px"}}/>;
      case "Multiple Choice":
        return (
          <MultipleChoice
            maxLength={60}
            titleHover={t("MAX_LENGTH_60")}
            t={t}
            addOption={handleAddOption}
            updateOption={handleUpdateOption}
            removeOption={handleRemoveOption}
            options={surveyQuestionConfig?.options}
            createNewSurvey={addOption}
            isPartiallyEnabled={isPartiallyEnabled}
            formDisabled={formDisabled}
          />
        );
      case "Check Boxes":
        return (
          <div>
          <Checkboxes
            t={t}
            addOption={handleAddOption}
            updateOption={handleUpdateOption}
            removeOption={handleRemoveOption}
            options={surveyQuestionConfig?.options}
            isPartiallyEnabled={isPartiallyEnabled}
            createNewSurvey={addOption}
            formDisabled={formDisabled}
            maxLength={60}
            titleHover={t("MAX_LENGTH_60")}
            // name={"checkBoxDesc"}
            // inputRef={register({
            //     maxLength: {
            //       value: 10,
            //       message: t("EXCEEDS_10_CHAR_LIMIT"),
            //     }
            //   })}
          />
            {/* {formState?.errors && <CardLabelError>{formState?.errors?.checkBoxDesc?.message}</CardLabelError>} */}
          </div>
        );
      default:
        return<div> 
                <TextInput 
                placeholder="SHORT ANSWER" 
                name={"shortAnsDescription"}
                inputRef={register({
                  maxLength: {
                    value: 200,
                    message: t("EXCEEDS_200_CHAR_LIMIT"),
                  }
                })}
                />
                {formState?.errors && <CardLabelError>{formState?.errors?.shortAnsDescription?.message}</CardLabelError>}
              </div>;
    }
  };
  
  return (
    <div className="newSurveyForm_wrapper">
      <span className="newSurveyForm_quesno">{`${t("CS_COMMON_QUESTION")} ${index + 1} * :`}</span>
      <span className="newSurveyForm_mainsection">
        <div className="newSurveyForm_questions">
          <div style={{width: "80%"}}>
            <TextInput
              placeholder={t("CS_COMMON_TYPE_QUESTION")}
              value={surveyQuestionConfig.questionStatement}
              onChange={(ev) => {
                setSurveyQuestionConfig((prevState) => ({ ...prevState, questionStatement: ev.target.value }));
              }}
              textInputStyle={{width: "100%"}}
              name={`QUESTION_SURVEY_${index}`}
              disable={disableInputs}
              inputRef={register({
                required: t("ES_ERROR_REQUIRED"),
                maxLength: {
                  value: 100,
                  message: t("EXCEEDS_100_CHAR_LIMIT"),
                },
                pattern:{
                  value: /^[A-Za-z_-][A-Za-z0-9_\ -?]*$/,
                  message: t("ES_SURVEY_DONT_START_WITH_NUMBER")
                }
              })}
            />
            {formState?.errors && <CardLabelError>{formState?.errors?.[`QUESTION_SURVEY_${index}`]?.message}</CardLabelError>}
          </div>
          <Dropdown
            option={dropdownOptions}
            select={(ev) => {
              setSurveyQuestionConfig((prevState) => ({ ...prevState, type: {title:ev.title,value:ev.value} }));
            }}
            //placeholder={"Short Answer"}
            //selected={surveyQuestionConfig.type || {title: "Short Answer",value: "SHORT_ANSWER_TYPE"}}
            optionKey="title"
            disable={disableInputs}
            selected={surveyQuestionConfig?.type}
          />
        </div>
        <div className="newSurveyForm_answer">{renderAnswerComponent(surveyQuestionConfig.type)}</div>
        <div className="newSurveyForm_actions">
          <div>
            <CheckBox
              onChange={(e) => setSurveyQuestionConfig((prevState) => ({ ...prevState, required: !prevState.required }))}
              checked={surveyQuestionConfig.required}
              label={t("CS_COMMON_REQUIRED")}
              pageType={"employee"}
              disable={disableInputs}
              style={{marginTop:"2px"}}
            />
          </div>
          {index!==0 && <div className="newSurveyForm_seprator" />}
          {index!==0 && <div className={`pointer ${disableInputs ? 'disabled-btn':''}`} onClick={() => dispatch({ type: "removeForm", payload: { index } })}>
          <div className="tooltip" /* style={{position:"relative"}} */>
              <div style={{display: "flex", /* alignItems: "center", */ gap: "0 4px"}}>
            <DustbinIcon />
            <span className="tooltiptext" style={{ position:"absolute",width:"100px", marginLeft:"50%", fontSize:"medium" }}>
              {t("CS_INFO_DELETE")}
              </span>
              </div>
              </div>
          </div>}
          </div>
      </span>
    </div>
  );
};

export default NewSurveyForm;
