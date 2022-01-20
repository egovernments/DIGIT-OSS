import { DatePicker, Dropdown, CheckBox, TextArea, TextInput } from "@egovernments/digit-ui-react-components";
import { DustbinIcon } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
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

const NewSurveyForm = ({ t, index, questionStatement, type, required, options, disableInputs, dispatch }) => {
  const [surveyQuestionConfig, setSurveyQuestionConfig] = useState({ questionStatement, type, required, options });

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
        return <TextArea />;
      case "Date":
        return <DatePicker />;
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
          />
        );
      default:
        return <TextInput />;
    }
  };

  return (
    <div className="newSurveyForm_wrapper">
      <span className="newSurveyForm_quesno">{`${t("CS_COMMON_QUESTION")} ${index + 1}`}</span>
      <span className="newSurveyForm_mainsection">
        <div className="newSurveyForm_questions">
          <TextInput
            placeholder={t("CS_COMMON_TYPE_QUESTION")}
            value={surveyQuestionConfig.questionStatement}
            onChange={(ev) => {
              setSurveyQuestionConfig((prevState) => ({ ...prevState, questionStatement: ev.target.value }));
            }}
            disable={disableInputs}
          />
          <Dropdown
            option={dropdownOptions}
            select={(ev) => {
              setSurveyQuestionConfig((prevState) => ({ ...prevState, type: ev.title }));
            }}
            selected={surveyQuestionConfig.type}
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
