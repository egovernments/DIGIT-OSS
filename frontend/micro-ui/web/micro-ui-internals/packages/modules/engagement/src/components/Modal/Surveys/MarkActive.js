import React from "react";
import { Modal, Card, CardText, TextInput, CardLabelError } from "@egovernments/digit-ui-react-components";
import { Controller, useForm } from "react-hook-form";

const Heading = (props) => {
  return <h1 className="heading-m">{props.t(props.heading)}</h1>;
};

const Close = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF">
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
  </svg>
);

const CloseBtn = (props) => {
  return (
    <div className="icon-bg-secondary" onClick={props.onClick}>
      <Close />
    </div>
  );
};

const isValidFromDate = () => true;
const isValidToDate = () => true;
const isValidFromTime = () => true;
const isValidToTime = () => true;

const MarkActiveModal = ({
  t,
  heading,
  surveyTitle,
  initialValues,
  onSubmit,
  closeModal,
  actionCancelLabel,
  actionCancelOnSubmit,
  actionSaveLabel,
  actionSaveOnSubmit,
}) => {
  const { fromDate, fromTime, toDate, toTime } = initialValues;
  const { control: controlSurveyForm, handleSubmit: handleSurveySettingSubmit, formState: surveyFormState } = useForm({
    defaultValues: {
      fromDate,
      fromTime,
      toDate,
      toTime,
    },
  });
  const formErrors = surveyFormState?.errors;
  return (
    <Modal
      headerBarMain={<Heading t={t} heading={heading} />}
      headerBarEnd={<CloseBtn onClick={closeModal} />}
      actionCancelLabel={t(actionCancelLabel)}
      actionCancelOnSubmit={actionCancelOnSubmit}
      actionSaveLabel={t(actionSaveLabel)}
      actionSaveOnSubmit={handleSurveySettingSubmit(actionSaveOnSubmit)}
      formId="modal-action"
      headerBarMainStyle={{marginLeft:"20px"}}
    >
      
      <Card style={{ boxShadow: "none" }}>
        <p>{t("CONFIRM_ACTIVE_SURVEY_MSG")} <br/> {surveyTitle} {t("CONFIRM_ACTIVE_SURVEY_MSG_END")}</p><br/>
        <form onSubmit={handleSurveySettingSubmit(onSubmit)}>
          <span className="surveyformfield">
            <label>{t("LABEL_SURVEY_START_DATE")}</label>
            <Controller
              control={controlSurveyForm}
              name="fromDate"
              defaultValue={surveyFormState?.fromDate}
              rules={{ required: true, validate: { isValidFromDate } }}
              render={({ onChange, value }) => <TextInput type="date" isRequired={true} onChange={onChange} defaultValue={value} />}
            />
            {formErrors && formErrors?.fromDate && formErrors?.fromDate?.type === "required" && (
              <CardLabelError>{t(`EVENTS_TO_DATE_ERROR_REQUIRED`)}</CardLabelError>
            )}
            {formErrors && formErrors?.fromDate && formErrors?.fromDate?.type === "isValidToDate" && (
              <CardLabelError>{t(`EVENTS_TO_DATE_ERROR_INVALID`)}</CardLabelError>
            )}
          </span>

          <span className="surveyformfield">
            <label>{t("LABEL_SURVEY_START_TIME")}</label>
            <Controller
              control={controlSurveyForm}
              name="fromTime"
              defaultValue={surveyFormState?.fromTime}
              rules={{ required: true, validate: { isValidFromTime } }}
              render={({ onChange, value }) => <TextInput type="time" isRequired={true} onChange={onChange} defaultValue={value} />}
            />
            {formErrors && formErrors?.fromTime && formErrors?.fromTime?.type === "required" && (
              <CardLabelError>{t(`EVENTS_TO_DATE_ERROR_REQUIRED`)}</CardLabelError>
            )}
            {formErrors && formErrors?.fromTime && formErrors?.fromTime?.type === "isValidToDate" && (
              <CardLabelError>{t(`EVENTS_TO_DATE_ERROR_INVALID`)}</CardLabelError>
            )}
          </span>

          <span className="surveyformfield">
            <label>{t("LABEL_SURVEY_END_DATE")}</label>
            <Controller
              control={controlSurveyForm}
              name="toDate"
              defaultValue={surveyFormState?.toDate}
              rules={{ required: true, validate: { isValidToDate } }}
              render={({ onChange, value }) => <TextInput type="date" isRequired={true} onChange={onChange} defaultValue={value} />}
            />
            {formErrors && formErrors?.toDate && formErrors?.toDate?.type === "required" && (
              <CardLabelError>{t(`EVENTS_TO_DATE_ERROR_REQUIRED`)}</CardLabelError>
            )}
            {formErrors && formErrors?.toDate && formErrors?.toDate?.type === "isValidToDate" && (
              <CardLabelError>{t(`EVENTS_TO_DATE_ERROR_INVALID`)}</CardLabelError>
            )}{" "}
          </span>

          <span className="surveyformfield">
            <label>{t("LABEL_SURVEY_END_TIME")}</label>

            <Controller
              control={controlSurveyForm}
              name="toTime"
              defaultValue={surveyFormState?.toTime}
              rules={{ required: true, validate: { isValidToTime } }}
              render={({ onChange, value }) => <TextInput type="time" isRequired={true} onChange={onChange} defaultValue={value} />}
            />
            {formErrors && formErrors?.toTime && formErrors?.toTime?.type === "required" && (
              <CardLabelError>{t(`EVENTS_TO_DATE_ERROR_REQUIRED`)}</CardLabelError>
            )}
            {formErrors && formErrors?.toTime && formErrors?.toTime?.type === "isValidToDate" && (
              <CardLabelError>{t(`EVENTS_TO_DATE_ERROR_INVALID`)}</CardLabelError>
            )}
          </span>
        </form>
      </Card>
    </Modal>
  );
};

export default MarkActiveModal;
