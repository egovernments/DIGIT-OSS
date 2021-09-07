import React from "react";
import { Toast } from "@egovernments/digit-ui-react-components";

function ApplicationDetailsToast({ t, showToast, closeToast, businessService }) {
  if (businessService.includes("NewTL") || businessService.includes("TL") || businessService.includes("EDITRENEWAL")) {
    let label = "";
    switch (showToast?.action?.action) {
      case "SENDBACK":
        label = showToast?.key === "error" ? showToast?.error?.message : t("TL_SENDBACK_CHECKLIST_MESSAGE_HEAD");
        break;
      case "FORWARD":
        label = showToast?.key === "error" ? showToast?.error?.message : t("TL_FORWARD_SUCCESS_MESSAGE_MAIN");
        break;
      case "APPROVE":
        label = showToast?.key === "error" ? showToast?.error?.message : t("TL_APPROVAL_CHECKLIST_MESSAGE_HEAD");
        break;
      case "SENDBACKTOCITIZEN":
        label = showToast?.key === "error" ? showToast?.error?.message : t("TL_SENDBACK_TOCITIZEN_CHECKLIST_MESSAGE_HEAD");
        break;
      case "REJECT":
        label = showToast?.key === "error" ? showToast?.error?.message : t("TL_APPROVAL_REJ_MESSAGE_HEAD");
        break;
      case "RESUBMIT":
        label = showToast?.key === "error" ? showToast?.error?.message : t("TL_APPLICATION_RESUBMIT_SUCCESS_MESSAGE_MAIN");
        break;
      case "CANCEL":
        label = showToast?.key === "error" ? showToast?.error?.message : t("TL_TL_CANCELLED_MESSAGE_HEAD");
        break;
      default:
        label = showToast?.key === "error" ? showToast?.error?.message : `ES_${businessService}_${showToast?.action?.action}_UPDATE_SUCCESS`;
    }
    return <React.Fragment>{showToast && <Toast error={showToast.key === "error"} label={label} onClose={closeToast} />}</React.Fragment>;
  } else {
    const label = showToast?.key === "error" ? showToast?.error?.message : `ES_${businessService}_${showToast?.action?.action}_UPDATE_SUCCESS`;
    return <React.Fragment>{showToast && <Toast error={showToast.key === "error"} label={t(label)} onClose={closeToast} />}</React.Fragment>;
  }
}

export default ApplicationDetailsToast;
