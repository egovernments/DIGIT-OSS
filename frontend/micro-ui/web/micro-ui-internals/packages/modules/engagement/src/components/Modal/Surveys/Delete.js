import React from "react";
import { Modal, Card, CardText } from "@egovernments/digit-ui-react-components";

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
// {`${t("CONFIRM_DELETE_MSG")} `}
const ConfirmationQuestion = ({ t, title }) => (
  <div className="confirmation_box">
    <span>
      {" "}
      {t("CONFIRM_DELETE_MSG_NEW")} <b>{` ${title}`}</b>{t("COMPLETELY_DELETE")} <br/><br />{t("COMPLETELY_DELETE_WARN_MSG")} 
    </span>
  </div>
);

const DeleteModal = ({ t, heading, surveyTitle, closeModal, actionCancelLabel, actionCancelOnSubmit, actionSaveLabel, actionSaveOnSubmit }) => {
  return (
    <Modal
      headerBarMain={<Heading t={t} heading={heading} />}
      headerBarEnd={<CloseBtn onClick={closeModal} />}
      actionCancelLabel={t(actionCancelLabel)}
      actionCancelOnSubmit={actionCancelOnSubmit}
      actionSaveLabel={t(actionSaveLabel)}
      actionSaveOnSubmit={actionSaveOnSubmit}
      formId="modal-action"
    >
      <ConfirmationQuestion t={t} title={surveyTitle} />
    </Modal>
  );
};

export default DeleteModal;
