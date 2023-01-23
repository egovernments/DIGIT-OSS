import React from 'react'
import Modal from '../hoc/Modal'
import { FormComposer } from '../hoc/FormComposer'
import { useTranslation } from 'react-i18next'


const Heading = (props) => {
    return <h1 className="heading-m">{props.label}</h1>;
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

const WorkflowModal = ({ config, onSubmit, closeModal }) => {
  const { t } = useTranslation()

  return <Modal
            headerBarMain={<Heading label={t(config.label.heading)} />}
            headerBarEnd={<CloseBtn onClick={closeModal} />}
            actionCancelLabel={t(config.label.cancel)}
            actionCancelOnSubmit={closeModal}
            actionSaveLabel={t(config.label.submit)}
            actionSaveOnSubmit={() => { }}
            formId="modal-action"
        >
            <FormComposer
                config={config.form}
                noBoxShadow
                inline
                childrenAtTheBottom
                onSubmit={onSubmit}
                defaultValues={{}}
                formId="modal-action"
            />
        </Modal>
}

export default WorkflowModal