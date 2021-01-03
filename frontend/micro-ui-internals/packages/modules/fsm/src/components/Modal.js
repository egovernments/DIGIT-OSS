import React from "react";

import { FormComposer, PopUp, HeaderBar, ButtonSelector } from "@egovernments/digit-ui-react-components";

const Close = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF">
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
  </svg>
);

const Heading = (props) => {
  return <h1 className="heading-m">{props.label}</h1>;
};

const CloseBtn = (props) => {
  return (
    <div className="icon-bg-secondary" onClick={props.onClick}>
      <Close />
    </div>
  );
};

const Modal = ({ closeModal, onSubmit, config }) => {
  return (
    <PopUp>
      <div className="popup-module">
        <HeaderBar main={<Heading label="Generate Demand" />} end={<CloseBtn onClick={closeModal} />} />
        <div className="popup-module-main">
          <FormComposer config={config} noBoxShadow inline onSubmit={onSubmit}>
            <div className="popup-module-action-bar">
              <ButtonSelector theme="border" label="Cancel" onSubmit={closeModal} />
              <ButtonSelector label="Save" />
            </div>
          </FormComposer>
        </div>
      </div>
    </PopUp>
  );
};

export default Modal;
