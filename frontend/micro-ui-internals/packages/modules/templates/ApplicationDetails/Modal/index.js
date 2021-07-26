import React, { useState, useEffect } from "react";
import FSMActionModal from "./FSMActionModal";
import PTActionModal from "./PTActionModal";
import TLActionModal from "./TLActionModal";

const ActionModal = (props) => {
  console.log(props.action, "inside action modal index");
  if (props?.businessService.includes("PT")) {
    return <PTActionModal {...props} />;
  }

  if (props?.businessService.includes("NewTL") || props?.businessService.includes("TL") || props?.businessService.includes("EDITRENEWAL") ) {
    return <TLActionModal {...props} />;
  }
  // return <FSMActionModal {...props} />;
};

export default ActionModal;
