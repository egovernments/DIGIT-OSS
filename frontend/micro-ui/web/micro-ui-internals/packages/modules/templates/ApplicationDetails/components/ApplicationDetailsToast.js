import React from "react";
import { Toast } from "@egovernments/digit-ui-react-components";

function ApplicationDetailsToast({ t, showToast, closeToast, businessService }) {
  if (businessService?.includes("NewTL") || businessService?.includes("TL") || businessService?.includes("EDITRENEWAL")) {
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
        label = showToast?.key === "error" ? showToast?.error?.message : t(`ES_${businessService}_${showToast?.action?.action}_UPDATE_SUCCESS`);
    }
    return <React.Fragment>{showToast && <Toast error={showToast.key === "error"} label={label} onClose={closeToast} />}</React.Fragment>;
  } else if (businessService?.includes("BPA") || businessService?.includes("BPA_LOW") || businessService?.includes("BPA_OC")) {
    const getMessage = (messages = []) => {
      let returnValue = messages[0];
      if(messages?.length == 2) returnValue = businessService?.includes("BPA_OC") ? t(messages[1]) : t(messages [0]);
      else returnValue = t(messages[0]);
      return returnValue;
    }
    let label = "";
    switch (showToast?.action?.action) {
      case "REVOCATE":
        label = showToast?.key === "error" ? showToast?.error?.message : getMessage(["BPA_APPROVAL_REVOCATED_MESSAGE_HEAD", "BPA_APPROVAL_OC_REVOCATED_MESSAGE_HEAD"]);
        break;
      case "VERIFY_AND_FORWARD":
        label = showToast?.key === "error" ? showToast?.error?.message : getMessage(["BPA_FORWARD_SUCCESS_MESSAGE_MAIN"]);
        break;
      case "SEND_BACK_TO_CITIZEN":
        label = showToast?.key === "error" ? showToast?.error?.message : getMessage(["BPA_SENDBACK_SUCCESS_MESSAGE_MAIN"]);
        break;
      case "APPROVE":
        label = showToast?.key === "error" ? showToast?.error?.message : getMessage(["BPA_APPROVAL_CHECKLIST_MESSAGE_HEAD"]);
        break;
      case "REJECT":
        label = showToast?.key === "error" ? showToast?.error?.message : getMessage(["BPA_APPROVAL_REJECTED_MESSAGE_HEAD", "BPA_OC_APPROVAL_REJECTED_MESSAGE_HEAD"]);
        break;
      case "FORWARD":
        label = showToast?.key === "error" ? showToast?.error?.message : getMessage(["BPA_FORWARD_SUCCESS_MESSAGE_MAIN"]);
        break;
      case "SEND_BACK_FOR_DOCUMENT_VERIFICATION":
      case "SEND_BACK_FOR_FIELD_INSPECTION":
        label = showToast?.key === "error" ? showToast?.error?.message : getMessage(["BPA_SENDBACK_SUCCESS_MESSAGE_MAIN"]);
        break;
      default:
        label = showToast?.key === "error" ? showToast?.error?.message : t(`ES_${businessService}_${showToast?.action?.action}_UPDATE_SUCCESS`);
    }
    return <React.Fragment>{showToast && <Toast error={showToast.key === "error"} label={label} onClose={closeToast} />}</React.Fragment>;
  } else {
    const label = showToast?.key === "error" ? showToast?.error?.message : `ES_${businessService}_${showToast?.action?.action}_UPDATE_SUCCESS`;
    return <React.Fragment>{showToast && <Toast error={showToast.key === "error"} label={t(label)} onClose={closeToast} />}</React.Fragment>;
  }
}

export default ApplicationDetailsToast;
