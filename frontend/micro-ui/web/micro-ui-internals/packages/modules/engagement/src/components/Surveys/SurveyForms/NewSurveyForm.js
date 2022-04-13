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

const dropdownOptions = [
  {
    title: "Short Answer",
    value: "SHORT_ANSWER_TYPE",
  },
  {
    title: "Multiple Choice",
    value: "MULTIPLE_ANSWER_TYPE",
  },
  {
    title: "Check Boxes",
    value: "CHECKBOX_ANSWER_TYPE",
  },
  {
    title: "Paragraph",
    value: "LONG_ANSWER_TYPE",
  },
  {
    title: "Date",
    value: "DATE_ANSWER_TYPE",
  },
  {
    title: "Time",
    value: "TIME_ANSWER_TYPE",
  },
];

const NewSurveyForm = ({ t, index, questionStatement, type, required, options, disableInputs, dispatch,isPartiallyEnabled,addOption,formDisabled}) => {
  const [surveyQuestionConfig, setSurveyQuestionConfig] = useState({ questionStatement, type, required, options:["option 1"] });
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
    switch (type) {
      case "Paragraph":
        return <TextArea value="LONG ANSWER"/>;
      case "Date":
        return <DatePicker stylesForInput={{ width: "calc(100% - 290px)" }}/>;
      case "Time":
        return <TimePicker />;
      case "Multiple Choice":
        return (
          <MultipleChoice
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
          <Checkboxes
            t={t}
            addOption={handleAddOption}
            updateOption={handleUpdateOption}
            removeOption={handleRemoveOption}
            options={surveyQuestionConfig?.options}
            isPartiallyEnabled={isPartiallyEnabled}
            createNewSurvey={addOption}
            formDisabled={formDisabled}
          />
        );
      default:
        return <TextInput value="SHORT ANSWER" />;
    }
  };

  return (
    <div className="newSurveyForm_wrapper">
      <span className="newSurveyForm_quesno">{`${t("CS_COMMON_QUESTION")} ${index + 1}`}</span>
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
                  value: 60,
                  message: t("EXCEEDS_60_CHAR_LIMIT"),
                },
                pattern:{
                  value: /^[A-Za-z_-][A-Za-z0-9_\ -]*$/,
                  message: t("ES_SURVEY_DONT_START_WITH_NUMBER")
                }
              })}
            />
            {formState?.errors?.title && <CardLabelError>{formState?.errors?.[`QUESTION_SURVEY_${index}`]?.message}</CardLabelError>}
          </div>
          <Dropdown
            option={dropdownOptions}
            select={(ev) => {
              setSurveyQuestionConfig((prevState) => ({ ...prevState, type: ev.title }));
            }}
            selected={surveyQuestionConfig.type || {title: "Short Answer",value: "SHORT_ANSWER_TYPE"}}
            optionKey="title"
            disable={disableInputs}
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
            />
          </div>
          <div className="newSurveyForm_seprator" />
          <div className={`pointer ${disableInputs ? 'disabled-btn':''}`} onClick={() => dispatch({ type: "removeForm", payload: { index } })}>
            <DustbinIcon />
          </div>
        </div>
      </span>
    </div>
  );
};

export default NewSurveyForm;
