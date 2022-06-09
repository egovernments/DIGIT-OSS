import { Loader, Modal, FormComposer } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";

import { configMCollectRejectApplication } from "./MCollectRejectApplication";

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

const ActionModal = ({ t, action, tenantId, closeModal, submitAction, applicationData, billData }) => {
  const [config, setConfig] = useState({});
  const [defaultValues, setDefaultValues] = useState({});

  function submit(data) {
    let bdata = [];
    billData?.map((bill) => {
      bdata.push({
        taxHeadCode: bill?.taxHeadCode,
        amount: bill?.amount,
      });
    });
    submitAction({
      Challan: {
        ...applicationData,
        applicationStatus: "CANCELLED",
        amount: bdata,
      },
    });
  }
  useEffect(() => {
    switch (action) {
      case "CANCEL_CHALLAN":
        return setConfig(
          configMCollectRejectApplication({
            t,
            action,
          })
        );
      default:
        break;
    }
  }, [action]);

  return action && config.form ? (
    <Modal
      headerBarMain={<Heading label={t(config.label.heading)} />}
      headerBarEnd={<CloseBtn onClick={closeModal} />}
      actionCancelLabel={t(config.label.cancel)}
      actionCancelOnSubmit={closeModal}
      actionSaveLabel={t(config.label.submit)}
      actionSaveOnSubmit={() => {}}
      formId="modal-action"
    >
      <FormComposer
        config={config.form}
        noBoxShadow
        inline
        childrenAtTheBottom
        onSubmit={submit}
        defaultValues={defaultValues}
        formId="modal-action"
      />
    </Modal>
  ) : (
    <Loader />
  );
};

export default ActionModal;
