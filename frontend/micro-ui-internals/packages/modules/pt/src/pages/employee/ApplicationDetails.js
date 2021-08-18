import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import ApplicationDetailsTemplate from "../../../../templates/ApplicationDetails";

import { useParams } from "react-router-dom";
import { Header } from "@egovernments/digit-ui-react-components";

const ApplicationDetails = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { id: applicationNumber } = useParams();
  const [showToast, setShowToast] = useState(null);

  const { isLoading, isError, data: applicationDetails, error } = Digit.Hooks.pt.useApplicationDetail(t, tenantId, applicationNumber);

  const {
    isLoading: updatingApplication,
    isError: updateApplicationError,
    data: updateResponse,
    error: updateError,
    mutate,
  } = Digit.Hooks.pt.useApplicationActions(tenantId);

  let workflowDetails = Digit.Hooks.useWorkflowDetails({
    tenantId: applicationDetails?.tenantId || tenantId,
    id: applicationDetails?.applicationData?.acknowldgementNumber,
    moduleCode: "PT",
    role: "PT_CEMP",
    // serviceData: applicationDetails,
  });

  const closeToast = () => {
    setShowToast(null);
  };

  const PT_CEMP = Digit.UserService.hasAccess(["PT_CEMP"]) || false;

  if (applicationDetails?.applicationData?.status === "ACTIVE" && PT_CEMP) {
    workflowDetails = {
      ...workflowDetails,
      data: {
        ...workflowDetails?.data,
        nextActions: [
          {
            action: "VIEW_DETAILS",
            auditDetails: null,
            roles: ["PT_CEMP"],
            tenantId: "pb",
          },
          {
            action: "UPDATE",
            auditDetails: null,
            roles: ["PT_CEMP"],
            tenantId: "pb",
          },
        ],
      },
    };
  }

  if (!(applicationDetails?.applicationDetails[0]?.title === "CS_FILE_DESLUDGING_APPLICATION_NO")) {
    applicationDetails?.applicationDetails?.shift();
    applicationDetails?.applicationDetails?.unshift({
      values: [
        { title: "CS_FILE_DESLUDGING_APPLICATION_NO", value: applicationDetails?.applicationData?.acknowldgementNumber },
        { title: "ES_APPLICATION_CHANNEL", value: `ES_APPLICATION_DETAILS_APPLICATION_CHANNEL_${applicationDetails?.applicationData?.channel}` },
      ],
    });
  }

  return (
    <div>
      <Header>{t("ES_TITLE_APPLICATION_DETAILS")}</Header>
      <ApplicationDetailsTemplate
        applicationDetails={applicationDetails}
        isLoading={isLoading}
        isDataLoading={isLoading}
        applicationData={applicationDetails?.applicationData}
        mutate={mutate}
        workflowDetails={workflowDetails}
        businessService="PT"
        showToast={showToast}
        setShowToast={setShowToast}
        closeToast={closeToast}
      />
    </div>
  );
};

export default ApplicationDetails;
