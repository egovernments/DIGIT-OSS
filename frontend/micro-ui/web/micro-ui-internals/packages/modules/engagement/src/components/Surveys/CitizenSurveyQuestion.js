import { Card, CardLabelError, CheckBox, RadioButtons, TextArea, TextInput } from "@egovernments/digit-ui-react-components";
import React, { Fragment } from "react";
import { Controller } from "react-hook-form";

const CitizenSurveyQuestion = ({ t, question, control, register, values, formState,formDisabled }) => {
  const formErrors = formState?.errors;
  
  if (!question) return;
  const displayAnswerField = (answerType) => {
    switch (answerType) {
      case "SHORT_ANSWER_TYPE":
        return (
          <>
            <TextInput
              name={question.uuid}
              disabled={formDisabled}
              type="text"
              inputRef={register({
                maxLength: {
                  value: 200,
                 message: t("EXCEEDS_200_CHAR_LIMIT"),
                },
                required:question.required,
              })}
            />
            {formErrors && formErrors?.[question.uuid] && formErrors?.[question.uuid]?.type === "required" && (
              <CardLabelError>{t(`CS_COMMON_REQUIRED`)}</CardLabelError>)}
            {formErrors && formErrors?.[question.uuid] && formErrors?.[question.uuid]?.type === "maxLength" && (
              <CardLabelError>{t(`EXCEEDS_200_CHAR_LIMIT`)}</CardLabelError>)} 
          </>
        );
      case "LONG_ANSWER_TYPE":
        return (
          <>
            <TextArea
              name={question.uuid}
              disabled={formDisabled}
              inputRef={register({
                maxLength: {

                  value: 500,
                  message: t("EXCEEDS_500_CHAR_LIMIT"),
                },
                required:question.required
              })}
            />
            {formErrors && formErrors?.[question.uuid] && formErrors?.[question.uuid]?.type === "required" && (
              <CardLabelError>{t(`CS_COMMON_REQUIRED`)}</CardLabelError>)} 
            {formErrors && formErrors?.[question.uuid] && formErrors?.[question.uuid]?.type === "maxLength" && (
              <CardLabelError>{t(`EXCEEDS_500_CHAR_LIMIT`)}</CardLabelError>)}
          </>
        );
      case "MULTIPLE_ANSWER_TYPE":
        return (
          <>
            <Controller
              control={control}
              name={question.uuid}
              //defaultValue={surveyFormState?.collectCitizenInfo}
              rules={{ required: question.required }}
              render={({ onChange, value }) => (
                <RadioButtons
                  disabled={formDisabled}
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
              //rules={{required:true}}
              rules={{ required:question.required }}
              render={({ onChange, value }) => {
                return (
                <div className="align-columns">
                  {question.options.map((option) => {
                    return (
                      <CheckBox
                        disable={formDisabled}
                        key={option}
                        onChange={(e) => {
                          if (e.target.checked) {
                            onChange([option,...value?value:[]]);             
                          } else {
                            value && onChange(value?.filter((item) => item !== option));
                          }
                        }}
                        checked={typeof value === "string" ? !!([value]?.find(e => e === option)) : !!value?.find(e => e === option)}
                        label={option}
                      />
                    );
                  })}
                </div>
              )}}
            />
            {formErrors && formErrors?.[question.uuid] && formErrors?.[question.uuid]?.type ==="required" && (
              <CardLabelError style={{marginTop:"20px"}}>{t(`CS_COMMON_REQUIRED`)}</CardLabelError>
            )}
          </>
        );
      // case "CHECKBOX_ANSWER_TYPE":
      //   return (
      //     <>
      //     {question.options.map((option,index) => (
      //     <div>
      //       <label for="checkbox">
      //         <input
      //         control={control}
      //         id={option}
      //         type="checkbox"
      //         name={option}
      //         value={option}
      //         ref={register({
      //           required:false,
      //         })}
      //       />
      //         {option}</label>
            
      //     </div>
      //     ))}
          
      //       {formErrors && formErrors?.[question.uuid] && formErrors?.[question.uuid]?.type ==="required" && (
      //         <CardLabelError>{t(`CS_COMMON_REQUIRED`)}</CardLabelError>
      //       )}
      //     </>
      //   );
      case "DATE_ANSWER_TYPE":
        return (
          <>
            <Controller
              control={control}
              name={question.uuid}
              //defaultValue=
              rules={{
                required: question.required,
                // validate: { isValidToDate }
              }}

              render={({ onChange, value }) => <TextInput disabled={formDisabled} type="date"  onChange={onChange} defaultValue={value} />}
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
                required: question.required,
                // validate: { isValidToTime }
              }}
              render={({ onChange, value }) => <TextInput type="time" disabled={formDisabled}  onChange={onChange} defaultValue={value} />}
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
            disabled={formDisabled}
            type="text"
            inputRef={register({
              maxLength: {
                value: 60,
                message: t("EXCEEDS_60_CHAR_LIMIT"),
              },
              required:question.required
            })}
          />
        );
    }
  };
  return (
    <Card>
      <div className="surveyQuestion-wrapper">
        <span className="question-title">{question.questionStatement} {question?.required? "*":""}</span>
        <span>{displayAnswerField(question.type)}</span>
      </div>
    </Card>
  );
};

export default CitizenSurveyQuestion;
