import React, { useState, useEffect } from "react";
import FSMActionModal from "./FSMActionModal";
import PTActionModal from "./PTActionModal";

const ActionModal = (props) => {
  if (props?.businessService === "PT") {
    return <PTActionModal {...props} />;
  }

  return <FSMActionModal {...props} />;
};

export default ActionModal;
