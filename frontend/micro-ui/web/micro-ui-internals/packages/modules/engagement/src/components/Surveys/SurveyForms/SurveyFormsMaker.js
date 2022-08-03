import React, { useEffect, useReducer } from "react";
import NewSurveyForm from "./NewSurveyForm";

const SurveyFormsMaker = ({ t, formsConfig, setSurveyConfig, disableInputs, isPartiallyEnabled, addOption, formDisabled, controlSurveyForm }) => {
const defaultFormsConfig = {
  question: "",
  answerType: "Short Answer",
  required: false,
  options: [],
};

const initialSurveyFormState = [defaultFormsConfig];

const surveyFormReducer = (state, { type, payload }) => {
  switch (type) {
    case "addNewForm":
      const newSurveyQues = [...state, defaultFormsConfig];
      payload.setSurveyConfig("questions", newSurveyQues);
      return newSurveyQues;
    case "updateForm":
      const updatedSurveyQues = [...state];
      updatedSurveyQues.splice(payload.index, 1, payload);
      payload.setSurveyConfig("questions", updatedSurveyQues);
      return updatedSurveyQues;
    case "removeForm":
      if (state.length === 1) return state;
      const copyOfSate = [...state];
      copyOfSate.splice(payload.index, 1);
      payload.setSurveyConfig("questions", copyOfSate);
      return copyOfSate;
  }
};

  const [surveyState, dispatch] = useReducer(surveyFormReducer, formsConfig ? formsConfig : initialSurveyFormState);

  const passingSurveyConfigInDispatch = ({ type, payload }) => {
    dispatch({ type, payload: { ...payload, setSurveyConfig } });
  };

  const renderPreviewForms = () => {
    return surveyState.length
      ? surveyState.map((config, index) => (
        <NewSurveyForm key={index} {...config} addOption={addOption} t={t} index={index} disableInputs={disableInputs} dispatch={passingSurveyConfigInDispatch} isPartiallyEnabled={isPartiallyEnabled} formDisabled={formDisabled} controlSurveyForm={controlSurveyForm} />
        ))
      : null;
  };

  return (
    <div className="surveyformslist_wrapper">
      <div className="heading">{t("CS_SURVEYS_QUESTIONS")}</div>
      {renderPreviewForms()}
      <div className="pointer">
        {surveyState.length < 30  && <button 
          // disabled={surveyState.length >= 30 ? "true":""}
          className={`unstyled-button link ${disableInputs ? "disabled-btn" : ""} ${surveyState.length >= 30 ? "disabled-btn":""} `}
          type="button"
          onClick={() => passingSurveyConfigInDispatch({ type: "addNewForm" })}
          disabled={surveyState.length >= 30?true:false}
        >
          {t("CS_COMMON_ADD_QUESTION")}
        </button>}
      </div>
    </div>
  );
};

export default SurveyFormsMaker;
