import React, { useState, useEffect } from "react";


import WorkflowPopup from "./WorkflowPopup";

const ActionModal = (props) => {
  //here we can render different modals based on respective modules
    return <WorkflowPopup {...props} />;
  

};

export default ActionModal;
