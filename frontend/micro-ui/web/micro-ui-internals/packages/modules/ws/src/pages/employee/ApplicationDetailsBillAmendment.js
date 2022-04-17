import { Header, MultiLink, Toast } from "@egovernments/digit-ui-react-components";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ApplicationDetailsTemplate from "../../../../templates/ApplicationDetails";

const ApplicationDetailsBillAmendment = () => {
  const { applicationNumber } = Digit.Hooks.useQueryParams();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const serviceType = "WATER";
  const [showToast, setShowToast] = useState(false);
  const { isLoading, isError, data: applicationDetails, error } = Digit.Hooks.ws.useWSApplicationDetailsBillAmendment(
    t,
    tenantId,
    applicationNumber,
    serviceType
  );
  const workflowDetails = Digit.Hooks.useWorkflowDetails({
    tenantId,
    id: applicationNumber,
    moduleCode: applicationDetails?.processInstancesDetails?.[0]?.businessService,
  });
  const {
    isLoading: updatingApplication,
    isError: updateApplicationError,
    data: updateResponse,
    error: updateError,
    isSuccess,
    mutate,
  } = Digit.Hooks.ws.useWSApplicationActions(serviceType);

  useEffect(() => {
    isSuccess && !updateApplicationError ? setShowToast(isSuccess) : null;
    updateApplicationError && !isSuccess ? setShowToast(updateApplicationError) : null;
  }, [updateApplicationError, isSuccess]);

  useEffect(() => {
    if (showToast) {
      setTimeout(() => setShowToast(false), 5000);
    }
  }, [showToast]);

  const [showOptions, setShowOptions] = useState(false);

  async function getCouponPDF({ tenantId, Amendments }) {
    const response = await Digit.PaymentService.generatePdf(tenantId, { Amendments: { ...Amendments.Amendments } }, "bill-amendment-credit-note");
    const fileStore = await Digit.PaymentService.printReciept(tenantId, { fileStoreIds: response.filestoreIds[0] });
    window.open(fileStore[response?.filestoreIds[0]], "_blank");
  }

  const dowloadOptions =
    applicationDetails?.applicationData?.applicationStatus === "APPROVED"
      ? [
          {
            order: 1,
            label: t("WS_DOWNLOAD_COUPON_PDF"),
            onClick: () => getCouponPDF({ tenantId, Amendments: applicationDetails?.billAmendmentSearch }),
          },
        ]
      : [];

  return (
    <Fragment>
      <div className={"employee-main-application-details"}>
        <div className={"employee-application-details"} style={{ marginBottom: "15px" }}>
          <Header styles={{ marginLeft: "0px", paddingTop: "10px", fontSize: "32px" }}>{t("CS_TITLE_APPLICATION_DETAILS")}</Header>
          {dowloadOptions && dowloadOptions.length > 0 && (
            <MultiLink
              className="multilinkWrapper employee-mulitlink-main-div"
              onHeadClick={() => setShowOptions(!showOptions)}
              displayOptions={showOptions}
              options={dowloadOptions}
              downloadBtnClassName={"employee-download-btn-className"}
              optionsClassName={"employee-options-btn-className"}
            />
          )}
        </div>
        <ApplicationDetailsTemplate
          applicationDetails={applicationDetails}
          isLoading={isLoading}
          isDataLoading={isLoading}
          applicationData={applicationDetails?.applicationData}
          mutate={mutate}
          workflowDetails={workflowDetails}
          businessService={applicationDetails?.processInstancesDetails?.[0]?.businessService} // businessService
          moduleCode="WS"
          showToast={false}
          setShowToast={() => {}}
          closeToast={() => {}}
          timelineStatusPrefix={`WF_${applicationDetails?.processInstancesDetails?.[0]?.businessService?.toUpperCase()}_`}
        />
      </div>
      {showToast ? (
        <Toast
          isDleteBtn={true}
          error={updateApplicationError ? "WS_APPLICATION_UPDATE_ERROR" : "WS_APPLICATION_UPDATE_SUCCESS"}
          label={isSuccess ? "WS_APPLICATION_UPDATE_SUCCESS" : updateError?.Error}
        />
      ) : null}
    </Fragment>
  );
};

export default ApplicationDetailsBillAmendment;
