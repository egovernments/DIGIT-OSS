import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ApplicationDetailsTemplate from "../../../../templates/ApplicationDetails";

import { useParams, useLocation } from "react-router-dom";
import { ActionBar, Header, Loader, SubmitBar } from "@egovernments/digit-ui-react-components";

const AssessmentDetails = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { id: applicationNumber } = useParams();
  const location = useLocation();
  const AssessmentData = location?.state?.Assessment;
  const [showToast, setShowToast] = useState(null);

  let { isLoading, isError, data: applicationDetails, error } = Digit.Hooks.pt.useApplicationDetail(t, tenantId, applicationNumber);
  const { isLoading: assessmentLoading, mutate: assessmentMutate } = Digit.Hooks.pt.usePropertyAssessment(tenantId);
  const {
    isLoading: ptCalculationEstimateLoading,
    data: ptCalculationEstimateData,
    mutate: ptCalculationEstimateMutate,
  } = Digit.Hooks.pt.usePtCalculationEstimate(tenantId);

  useEffect(() => {
    ptCalculationEstimateMutate({ Assessment: AssessmentData });
  }, []);

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

  applicationDetails?.applicationDetails?.shift();
  applicationDetails?.applicationDetails?.unshift({
    title: "ES_PT_TITLE_PROPERTY_TAX_BILL_DETAILS",
    values: [
      {
        title: "PT_TITLE_UNIQUE_PROPERTY_ID",
        value: applicationNumber,
      },
      {
        title: "ES_PT_TITLE_BILLING_PERIOD",
        value: location?.state?.Assessment?.financialYear,
      },
    ],
    additionalDetails: {
      taxHeadEstimatesCalculation: ptCalculationEstimateData?.Calculation[0],
    },
  });

  const closeToast = () => {
    setShowToast(null);
  };

  const handleAssessment = () => {
    assessmentMutate(
      { Assessment: AssessmentData },
      {
        onError: (error, variables) => {
          setShowToast({ key: "error", action: error?.response?.data?.Errors[0]?.message || error });
          setTimeout(closeToast, 5000);
        },
        onSuccess: (data, variables) => {
          setShowToast({ key: "success", action: "ASSESSMENT" });
          setTimeout(closeToast, 5000);
        },
      }
    );
  };

  if (ptCalculationEstimateLoading || assessmentLoading) {
    return <Loader />;
  }

  return (
    <div>
      <Header>{t("ES_PT_TITLE_ASSESSMENT_DETAILS")}</Header>
      <ApplicationDetailsTemplate
        applicationDetails={applicationDetails}
        isLoading={isLoading}
        isDataLoading={isLoading}
        applicationData={applicationDetails?.applicationData}
        mutate={mutate}
        workflowDetails={workflowDetails}
        businessService="PT"
        assessmentMutate={assessmentMutate}
        ptCalculationEstimateMutate={ptCalculationEstimateMutate}
        showToast={showToast}
        setShowToast={setShowToast}
        closeToast={closeToast}
      />
      <ActionBar>
        <SubmitBar label={t("ES_PT_TITLE_ASSESS_PROPERTY")} onSubmit={handleAssessment} />
      </ActionBar>
    </div>
  );
};

export default AssessmentDetails;
