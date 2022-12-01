import { Header, MultiLink, Toast } from "@egovernments/digit-ui-react-components";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ApplicationDetailsTemplate from "../../../../templates/ApplicationDetails";
import  getPDFData  from "../../utils/getWsAckDataForBillAmendPdf";

const ApplicationDetailsBillAmendment = () => {
  const { applicationNumber } = Digit.Hooks.useQueryParams();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  let serviceType = "WATER";
  if(applicationNumber.includes("SW"))
  serviceType = "SEWERAGE"
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
    config:{enabled:applicationDetails?.processInstancesDetails?.[0]?.businessService?true:false}
  });
  
 
  workflowDetails?.data?.actionState?.nextActions?.forEach((action) => {
    if (action?.action === "RE-SUBMIT") {
      let pathName = `/digit-ui/employee/ws/bill-amendment?connectionNumber=${applicationDetails?.applicationData?.connectionNo}&tenantId=${tenantId}&isEdit=true`;
      action.redirectionUrll = {
        action: "RE-SUBMIT-APPLICATION",
        pathname: pathName,
        state: {
          applicationDetails: applicationDetails,
          action: "RE-SUBMIT-APPLICATION"
        },
      };
    }
  })
  const {
    isLoading: updatingApplication,
    isError: updateApplicationError,
    data: updateResponse,
    error: updateError,
    isSuccess,
    mutate,
  } = Digit.Hooks.ws.useApplicationActionsBillAmendUpdate();
  // useEffect(() => {
  //   isSuccess && !updateApplicationError ? setShowToast(isSuccess) : null;
  //   updateApplicationError && !isSuccess ? setShowToast(updateApplicationError) : null;
  // }, [updateApplicationError, isSuccess]);

  useEffect(() => {
    if (showToast) {
      setTimeout(() => setShowToast(false), 5000);
    }
  }, [showToast]);

  const [showOptions, setShowOptions] = useState(false);

  async function getCouponPDF({ tenantId, Amendments }) {
    const stateId = Digit.ULBService.getStateId();
    const response = await Digit.PaymentService.generatePdf(stateId, { Amendments:[Amendments] }, "bill-amendment-credit-note");
    const fileStore = await Digit.PaymentService.printReciept(stateId, { fileStoreIds: response.filestoreIds[0] });
    window.open(fileStore[response?.filestoreIds[0]], "_blank");
  }

  const getAckPdf = async (amendment,tenantId,t,tableData,app) => {
    const PDFdata = getPDFData(amendment,tenantId,t,tableData,app);
    PDFdata.then((ress) => Digit.Utils.pdf.generateBillAmendPDF(ress));
  };
  const dowloadOptions =
    applicationDetails?.amendment?.status === "CONSUMED"
      ? [
          // {
          //   order: 2,
          //   label: t("WS_DOWNLOAD_COUPON_PDF"),
          //   onClick: () => getCouponPDF({ tenantId, Amendments: applicationDetails?.amendment }),
          // },
          {
          order: 1,
          label: t("WS_ACK_PDF"),
            onClick: () => getAckPdf(applicationDetails?.amendment, tenantId, t, applicationDetails?.applicationDetails,applicationDetails),
          },
        ]
      : [
        {
          order: 1,
          label: t("WS_ACK_PDF"),
          onClick: () => getAckPdf(applicationDetails?.amendment, tenantId, t, applicationDetails?.applicationDetails,applicationDetails ),
        },
      ];

  return (
    <Fragment>
      <div className={"employee-main-application-details"}>
        <div className={"employee-application-details"} style={{ marginBottom: "15px" }}>
          <Header styles={{ marginLeft: "0px", paddingTop: "10px", fontSize: "32px" }}>{t("CS_TITLE_GENERATE_NOTE")}</Header>
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
          showToast={showToast}
          setShowToast={setShowToast}
          closeToast={()=>setShowToast(null)}
          timelineStatusPrefix={`WF_${applicationDetails?.processInstancesDetails?.[0]?.businessService?.toUpperCase()}_`}
        />
      </div>
      {showToast ? (
        <Toast
          isDleteBtn={true}
          error={updateApplicationError ? "WS_APPLICATION_UPDATE_ERROR" : null}
          label={isSuccess ? showToast?.label : updateError?.Error}
        />
      ) : null}
    </Fragment>
  );
};

export default ApplicationDetailsBillAmendment;
