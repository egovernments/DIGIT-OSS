import React, { useState, useEffect } from "react";
import FSMActionModal from "./FSMActionModal";
import PTActionModal from "./PTActionModal";
import TLActionModal from "./TLActionModal";
import BPAREGActionModal from "./BPAREGActionModal";
import BPAActionModal from "./BPAActionModal";
import NOCActionModal from "./NOCActionModal";
import ElectricalPlanModal from "./ElectricalPlanModal";
import ServicePlanModal from "./ServicePlanModal";
import BankGuaranteePlanModal from "./BankGuaranteePlanModal";
import TransferLicModal from "./TransferLicModal";
import RevisedPlanModal from "./RevisedPlanModal";

import StandardDesignModal from "./StandardDesignActionModal";
import SurrenderActionModal from "./SurrenderActionModal";
import BeneficialModal from "./ChangeInBenIntModal";
import ExtensionCluModal from "./ExtensionCluModal";
import CompletionLicModal from "./CompletionActionModal";
import TechnicalProfessionalModal from "./TechnicalProfessionalModal";
import ExtensionLicModal from "./extensionConstructionModal";
import LowMediumModal from "./LowMediumModal";

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
    return <BankGuaranteePlanModal {...props} />;
  }
  // if (props?.businessService.includes("BG_MORTGAGE")) {
  //   return <BankGuaranteePlanModal {...props} />;
  // }
  if (props?.businessService.includes("SURREND_OF_LICENSE")) {
    return <SurrenderActionModal {...props} />;
  }
  if (props?.businessService.includes("CHANGE_OF_BENEFICIAL")) {
    return <BeneficialModal {...props} />;
  }
  if (props?.businessService.includes("EXTENTION_OF_CLU_PERMISSION")) {
    return <ExtensionCluModal {...props} />;
  }
  if (props?.businessService.includes("COMPLETION_CERTIFICATE")) {
    return <CompletionLicModal {...props} />;
  }
  if (props?.businessService.includes("TECHNICAL_PROFESSIONAL")) {
    return <TechnicalProfessionalModal {...props} />;
    }
    if (props?.businessService.includes("BPA_LOW")) {
      return <LowMediumModal {...props} />;
      }
   if (props?.businessService.includes("CONSTRUCTION_OF_COMMUNITY")) {
    return <ExtensionLicModal {...props} />;
  }
  // return <FSMActionModal {...props} />;
};

export default ActionModal;
