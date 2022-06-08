import React, { useState, useEffect } from "react";
import FSMActionModal from "./FSMActionModal";
import PTActionModal from "./PTActionModal";
import TLActionModal from "./TLActionModal";
import BPAREGActionModal from "./BPAREGActionModal";
import BPAActionModal from "./BPAActionModal";
import NOCActionModal from "./NOCActionModal";
import WNSActionModal from "./WNSActionModal";

const ActionModal = (props) => {
  if (props?.businessService.includes("PT")) {
    return <PTActionModal {...props} />;
  }

  if (props?.businessService.includes("NewTL") || props?.businessService.includes("TL") || props?.businessService.includes("EDITRENEWAL") || props?.businessService.includes("DIRECTRENEWAL")) {
    return <TLActionModal {...props} />;
  }

  if (props?.moduleCode.includes("BPAREG")) {
    return <BPAREGActionModal {...props} />;
  }

  if (props?.moduleCode.includes("BPA")) {
    return <BPAActionModal {...props} />;
  }

  if (props?.moduleCode.includes("NOC")) {
    return <NOCActionModal {...props} />;
  }

  if (props?.moduleCode.includes("WS")) {
    return <WNSActionModal {...props} />;
  }
  // return <FSMActionModal {...props} />;
};

export default ActionModal;
