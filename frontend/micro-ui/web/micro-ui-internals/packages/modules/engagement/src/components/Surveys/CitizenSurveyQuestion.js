import { Card, CardLabelError, CheckBox, RadioButtons, TextArea, TextInput } from "@egovernments/digit-ui-react-components";
import React, { Fragment } from "react";
import { Controller } from "react-hook-form";

const CitizenSurveyQuestion = ({ t, question, control, register, values, formState }) => {
  const formErrors = formState?.errors;
  if (!question) return;
  const displayAnswerField = (answerType) => {
    switch (answerType) {
      case "SHORT_ANSWER_TYPE":
        return (
          <TextInput
            name={question.uuid}
            type="text"
            inputRef={register({
              maxLength: {
                value: 60,
                message: t("EXCEEDS_60_CHAR_LIMIT"),
              },
            })}
          />
        );
      case "LONG_ANSWER_TYPE":
        return (
          <TextArea
            name={question.uuid}
            inputRef={register({
              maxLength: {
                value: 160,
                message: t("EXCEEDS_160_CHAR_LIMIT"),
              },
            })}
          />
        );
      case "MULTIPLE_ANSWER_TYPE":
        return (
          <>
            <Controller
              control={control}
              name={question.uuid}
              //defaultValue={surveyFormState?.collectCitizenInfo}
              rules={{ required: true }}
              render={({ onChange, value }) => (
                <RadioButtons
                  onSelect={onChange}
                  selectedOption={value}
                  optionsKey=""
                  options={[...question.options]}
                  //disabled={disableInputs}
                />
              )}
            />
            {formErrors && formErrors?.[question.uuid] && formErrors?.[question.uuid]?.type === "required" && (
              <CardLabelError>{t(`EVENTS_TO_DATE_ERROR_REQUIRED`)}</CardLabelError>
            )}
          </>
        );
      case "CHECKBOX_ANSWER_TYPE":
        return (
          <>
            <Controller
              control={control}
              name={question.uuid}
              //defaultValue={surveyFormState?.collectCitizenInfo}
              //rules={{ required: true }}
              render={({ onChange, value }) => (
                <div className="align-columns">
                  {question.options.map((option) => {
                    return (
                      <CheckBox
                        key={option}
                        onChange={(e) => {
                          //console.log("onChange", {e, value});
                          if (e.target.checked ) {
                            value && onChange([...value, option]);
                          } else {
                            value && onChange(value.filter((item) => item !== option));
                          }
                        }}
                        checked={value}
                        label={option}
                      />
                    );
                  })}
                </div>
              )}
            />
            {formErrors && formErrors?.[question.uuid] && formErrors?.[question.uuid]?.type === "required" && (
              <CardLabelError>{t(`EVENTS_TO_DATE_ERROR_REQUIRED`)}</CardLabelError>
            )}
          </>
        );
      case "DATE_ANSWER_TYPE":
        return (
          <>
            <Controller
              control={control}
              name={question.uuid}
              //defaultValue=
              rules={{
                required: true,
                // validate: { isValidToDate }
              }}
              render={({ onChange, value }) => <TextInput type="date" isRequired={true} onChange={onChange} defaultValue={value} />}
            />
            {formErrors && formErrors?.[question.uuid] && formErrors?.[question.uuid]?.type === "required" && (
              <CardLabelError>{t(`EVENTS_TO_DATE_ERROR_REQUIRED`)}</CardLabelError>
            )}
          </>
        );
      case "TIME_ANSWER_TYPE":
        return (
          <>
            <Controller
              control={control}
              name={question.uuid}
              //defaultValue={surveyFormState?.toTime}
              rules={{
                required: true,
                // validate: { isValidToTime }
              }}
              render={({ onChange, value }) => <TextInput type="time" isRequired={true} onChange={onChange} defaultValue={value} />}
            />
            {formErrors && formErrors?.[question.uuid] && formErrors?.[question.uuid]?.type === "required" && (
              <CardLabelError>{t(`EVENTS_TO_DATE_ERROR_REQUIRED`)}</CardLabelError>
            )}
          </>
        );

      default:
        return (
          <TextInput
            name={question.uuid}
            type="text"
            inputRef={register({
              maxLength: {
                value: 60,
                message: t("EXCEEDS_60_CHAR_LIMIT"),
              },
            })}
          />
        );
    }
  };
  //console.log("<<<<what >>>", { question });
  return (
    <Card>
      <div className="surveyQuestion-wrapper">
        <span className="question-title">{question.questionStatement}</span>
        <span>{displayAnswerField(question.type)}</span>
      </div>
    </Card>
  );
};

export default CitizenSurveyQuestion;
