import { DatePicker, Dropdown, CheckBox, TextArea, TextInput, CardLabelError } from "@egovernments/digit-ui-react-components";
import { DustbinIcon } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import TimePicker from "react-time-picker";
import Checkboxes from "./AnswerTypes/Checkboxes";
import MultipleChoice from "./AnswerTypes/MultipleChoice";

// const answerTypeEnum = {
//   "Short Answer": "SHORT_ANSWER_TYPE",
//   Paragraph: "LONG_ANSWER_TYPE",
//   "Multiple Choice": "MULTIPLE_ANSWER_TYPE",
//   "Check Boxes": "CHECKBOX_ANSWER_TYPE",
//   Date: "DATE_ANSWER_TYPE",
//   Time: "TIME_ANSWER_TYPE",
// };


const NewSurveyForm = ({ t, index, questionStatement, type, uuid, qorder, required, options, disableInputs, dispatch, isPartiallyEnabled, addOption, formDisabled, controlSurveyForm }) => {
  
  const dropdownOptions = [
    {
      title: t("Surveys_Short_Answer"),
      i18Key: "SHORT_ANSWER_TYPE",
      value: "SHORT_ANSWER_TYPE",
    },
    {
      title: t("Surveys_Multiple_Choice"),
      i18Key: "MULTIPLE_ANSWER_TYPE",
      value:  "MULTIPLE_ANSWER_TYPE",
    },
    {
      title: t("Surveys_Check_Boxes"),
      i18Key: "CHECKBOX_ANSWER_TYPE",
      value:  "CHECKBOX_ANSWER_TYPE",
    },
    {
      title: t("Surveys_Paragraph"),
      i18Key: "LONG_ANSWER_TYPE",
      value:  "LONG_ANSWER_TYPE",
    },
    {
      title: t("Surveys_Date"),
      i18Key: "DATE_ANSWER_TYPE",
      value:  "DATE_ANSWER_TYPE",
    },
    {
      title: t("Surveys_Time"),
      i18Key: "TIME_ANSWER_TYPE",
      value:  "TIME_ANSWER_TYPE",
    },
  ];


  const selectedType = dropdownOptions.filter(option => option?.value === (typeof type === "object" ? type.value : type))
  const isInputDisabled = window.location.href.includes("/employee/engagement/")
  
  const [surveyQuestionConfig, setSurveyQuestionConfig] = useState({
    questionStatement, type: type ? selectedType?.[0]  : {
      title: t("SHORT_ANSWER_TYPE"),
      i18Key: "SHORT_ANSWER_TYPE",
      value: "SHORT_ANSWER_TYPE",
    }, required, options:options?.length>0?options:[`${t("CMN_OPTION")} 1`],uuid:uuid, qorder });
  const { register, formState  } = useFormContext();

  useEffect(() => {
    setSurveyQuestionConfig({
      questionStatement, type: type ? selectedType?.[0]  : {
        title: t("SHORT_ANSWER_TYPE"),
        i18Key: "SHORT_ANSWER_TYPE",
        value: "SHORT_ANSWER_TYPE",
      }, required, options:options?.length>0?options:[`${t("CMN_OPTION")} 1`],uuid:uuid, qorder })
  },[questionStatement])

  const handleAddOption = () =>
    setSurveyQuestionConfig((prevState) => {
      const updatedState = { ...prevState };
      updatedState.options.push(`${t("CMN_OPTION")} ${updatedState.options.length + 1}`);
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
    if (surveyQuestionConfig.options.length === 1 || (isPartiallyEnabled ? !isPartiallyEnabled : formDisabled)) return;
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
    switch (type?.value) {
      case "LONG_ANSWER_TYPE":
        return <div>
          <TextArea 
            placeholder={t("LONG_ANSWER_TYPE")}
            disabled={isInputDisabled}
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
      case "DATE_ANSWER_TYPE":
        return <DatePicker stylesForInput={{ width: "calc(100% - 290px)" }} style={{width:"202px"}} disabled={isInputDisabled}/>;
      case "TIME_ANSWER_TYPE":
        return <TextInput type="time" textInputStyle={{width:"202px"}} disable={isInputDisabled}/>;
      case "MULTIPLE_ANSWER_TYPE":
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
            isInputDisabled={isInputDisabled}
            isPartiallyEnabled={isPartiallyEnabled}
            formDisabled={formDisabled}
          />
        );
      case "CHECKBOX_ANSWER_TYPE":
        return (
          <div>
          <Checkboxes
            t={t}
            addOption={handleAddOption}
            updateOption={handleUpdateOption}
            removeOption={handleRemoveOption}
            options={surveyQuestionConfig?.options}
            isInputDisabled={isInputDisabled}
            isPartiallyEnabled={isPartiallyEnabled}
            createNewSurvey={addOption}
            formDisabled={formDisabled}
            maxLength={60}
            titleHover={t("MAX_LENGTH_60")}
            labelstyle={{marginLeft:"-20px"}}
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
                placeholder={t("SHORT_ANSWER_TYPE")} 
                name={"shortAnsDescription"}
                disabled={isInputDisabled}
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
      <span className="newSurveyForm_quesno">{`${t("CS_COMMON_QUESTION")} ${index + 1} `}</span>
      <span className="newSurveyForm_mainsection">
        <div className="newSurveyForm_questions">
          <div style={{width: "75%"}}>
            <TextInput
              placeholder={t("CS_COMMON_TYPE_QUESTION")}
              //value={t(Digit.Utils.locale.getTransformedLocale(surveyQuestionConfig.questionStatement))}
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
          t={t}
            option={dropdownOptions}
            select={(ev) => {
              setSurveyQuestionConfig((prevState) => ({ ...prevState, type: {title:ev.title,i18Key:ev.i18Key,value:ev.value} }));
            }}
            //placeholder={"Short Answer"}
            //selected={surveyQuestionConfig.type || {title: "Short Answer",value: "SHORT_ANSWER_TYPE"}}
            optionKey="i18Key"
            disable={disableInputs}
            selected={surveyQuestionConfig?.type}
          />
        </div>
        <div className="newSurveyForm_answer">{renderAnswerComponent(surveyQuestionConfig?.type)}</div>
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
