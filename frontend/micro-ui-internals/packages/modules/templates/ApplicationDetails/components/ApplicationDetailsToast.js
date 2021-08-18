import React from "react";
import { Toast } from "@egovernments/digit-ui-react-components";

function ApplicationDetailsToast({ t, showToast, closeToast, businessService }) {
  const label = showToast
    ? showToast?.action?.length > 50
      ? showToast?.action
      : t(
          showToast?.key === "success"
            ? businessService === "PT"
              ? `ES_PT_${showToast.action}_UPDATE_SUCCESS`
              : `ES_FSM_${showToast.action}_UPDATE_SUCCESS`
            : showToast.action
        )
    : null;
  return (
    <React.Fragment>{showToast && <Toast error={showToast.key === "error" ? true : false} label={label} onClose={closeToast} />}</React.Fragment>
  );
}

export default ApplicationDetailsToast;
