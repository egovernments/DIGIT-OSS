import React, { useEffect, useReducer } from "react";
import NewSurveyForm from "./NewSurveyForm";

const defaultFormsConfig = {
  question: "",
  answerType: "Short Answer",
  required: false,
  options: [],
};

const initialSurveyFormState = {
  formsConfig: [defaultFormsConfig],
  formsCount: 1,
};

const surveyFormReducer = (state, { type, payload }) => {
  switch (type) {
    case "addNewForm":
      const newState = {
        ...state,
        formsConfig: [...state.formsConfig, defaultFormsConfig],
        formsCount: state.formsCount + 1,
      };
      //console.log("addNewForm >>>", { newState });
      payload.setSurveyConfig("questions", newState);
      return newState;
    case "updateForm":
      const updatedState = { ...state };
      updatedState.formsConfig.splice(payload.index, 1, payload);
      //console.log("updateForm >>>", { updatedState });
      payload.setSurveyConfig("questions", updatedState);
      return updatedState;
    case "removeForm":
      if (state.formsCount === 1) return state;
      state.formsConfig.splice(payload.index, 1);
      //console.log("removeForm >>>", { state });
      payload.setSurveyConfig("questions", state);
      return {
        ...state,
        formsCount: state.formsCount - 1,
      };
  }
};

const SurveyFormsMaker = ({ t, formsConfig, setSurveyConfig }) => {
  const [surveyState, dispatch] = useReducer(surveyFormReducer, formsConfig ? formsConfig : initialSurveyFormState);
  
  const passingSurveyConfigInDispatch = ({ type, payload }) => {
    dispatch({ type, payload: { ...payload, setSurveyConfig } });
  };

  const renderPreviewForms = () => {
    return surveyState.formsConfig.map((config, index) => (
      <NewSurveyForm key={index} {...config} t={t} index={index} dispatch={passingSurveyConfigInDispatch} />
    ));
  };

  return (
    <div className="surveyformslist_wrapper">
      <div className="heading">{t("CS_SURVEYS_QUESTIONS")}</div>
      {renderPreviewForms()}
      <div className="pointer">
        <button className="unstyled-button link" type="button" onClick={() => passingSurveyConfigInDispatch({ type: "addNewForm" })}>
          {t("CS_COMMON_ADD_QUESTION")}
        </button>
      </div>
    </div>
  );
};

export default SurveyFormsMaker;
