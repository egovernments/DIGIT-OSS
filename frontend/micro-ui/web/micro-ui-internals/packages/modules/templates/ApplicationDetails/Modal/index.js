import React, { useState, useEffect } from "react";
import FSMActionModal from "./FSMActionModal";
import PTActionModal from "./PTActionModal";
import TLActionModal from "./TLActionModal";
import BPAREGActionModal from "./BPAREGActionModal";
import BPAActionModal from "./BPAActionModal";
import NOCActionModal from "./NOCActionModal";
import ElectricalPlanModal from "./ElectricalPlanModal";
import ServicePlanModal from "./ServicePlanModal";
import BankGuaranteePlan from "./BankGuaranteePlan";
import TransferLicModal from "./TransferLicModal";
import RevisedPlanModal from "./RevisedPlanModal";

import StandardDesignModal from "./StandardDesignActionModal";

const ActionModal = (props) => {
  if (props?.businessService.includes("PT")) {
    return <PTActionModal {...props} />;
  }

  if (
    props?.businessService.includes("NewTL") ||
    props?.businessService.includes("TL") ||
    props?.businessService.includes("EDITRENEWAL") ||
    props?.businessService.includes("DIRECTRENEWAL")
  ) {
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

  if (props?.businessService.includes("ELECTRICAL_PLAN")) {
    return <ElectricalPlanModal {...props} />;
  }

  if (props?.businessService.includes("SERVICE_PLAN")) {
    return <ServicePlanModal {...props} />;
  }
  if (props?.businessService.includes("APPROVAL_OF_STANDARD")) {
    return <StandardDesignModal {...props} />;
  }
  if (props?.businessService.includes("TRANSFER_OF_LICIENCE")) {
    return <TransferLicModal {...props} />;
  }
  if (props?.businessService.includes("REVISED_LAYOUT_PLAN")) {
    return <RevisedPlanModal {...props} />;
  }
  if (props?.businessService.includes("BG_NEW")) {
    return <BankGuaranteePlan {...props} />;
  }
  if (props?.businessService.includes("BG_MORTGAGE")) {
    return <BankGuaranteePlan {...props} />;
  }
  // return <FSMActionModal {...props} />;
};

export default ActionModal;
