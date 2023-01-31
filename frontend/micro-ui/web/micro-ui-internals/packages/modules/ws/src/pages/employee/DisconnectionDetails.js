import React, { useEffect, useState, Fragment, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Header, MultiLink } from "@egovernments/digit-ui-react-components";
import ApplicationDetailsTemplate from "../../../../templates/ApplicationDetails";
import * as func from "../../utils";
import cloneDeep from "lodash/cloneDeep";
import getPDFData from "../../utils/getWSDisconnectionApplicationForm";
import { ifUserRoleExists } from "../../utils";

const GetDisconnectionDetails = () => {
  const { t } = useTranslation();
  const menuRef = useRef();
  let filters = func.getQueryStringParams(location.search);
  const [showOptions, setShowOptions] = useState(false);
  const [showToast, setShowToast] = useState(null);

  const tenantId = Digit.ULBService.getCurrentTenantId();
  const applicationNumber = filters?.applicationNumber;
  const serviceType = filters?.service;
  const stateCode = Digit.ULBService.getStateId();

  sessionStorage.removeItem("Digit.PT_CREATE_EMP_WS_NEW_FORM");
  sessionStorage.removeItem("IsDetailsExists");
  sessionStorage.setItem("disconnectionURL", JSON.stringify({url : `${location?.pathname}${location.search}`}));

  let { isLoading, isError, data: applicationDetails, error } = Digit.Hooks.ws.useDisConnectionDetails(t, tenantId, applicationNumber, serviceType,{ privacy: Digit.Utils.getPrivacyObject() } );
  const { isServicesMasterLoading, data: servicesMasterData } = Digit.Hooks.ws.useMDMS(stateCode, "ws-services-masters", ["WSEditApplicationByConfigUser"]);
  const appStatus = applicationDetails?.applicationData?.applicationStatus || "";

  let workflowDetails = Digit.Hooks.useWorkflowDetails(
    {
      tenantId: tenantId,
      id: applicationNumber,
      moduleCode: applicationDetails?.processInstancesDetails?.[0]?.businessService,
    },
    {
      enabled: applicationDetails?.processInstancesDetails?.[0]?.businessService ? true : false,
    }
  );

  const {
    isLoading: updatingApplication,
    isError: updateApplicationError,
    data: updateResponse,
    error: updateError,
    mutate,
  } = Digit.Hooks.ws.useWSApplicationActions(serviceType);

  const closeToast = () => {
    setShowToast(null);
    // setError(null);
  };
  const closeMenu = () => {
    setShowOptions(false);
  };
  Digit.Hooks.useClickOutside(menuRef, closeMenu, showOptions);

  const mobileView = Digit.Utils.browser.isMobile();

  if (
    workflowDetails?.data?.nextActions?.length > 0 &&
    workflowDetails?.data?.actionState?.nextActions?.length > 0 &&
    !workflowDetails?.data?.actionState?.nextActions?.find((e) => e.action === "EDIT") &&
    !workflowDetails?.data?.actionState?.nextActions?.find((e) => e.action === "RESUBMIT_APPLICATION") &&
    !workflowDetails?.data?.actionState?.nextActions?.find((e) => e.action === "EXECUTE_DISCONNECTION") && 
    !workflowDetails?.data?.actionState?.nextActions?.find((e) => e.action === "SUBMIT_APPLICATION") &&
    !workflowDetails?.data?.actionState?.nextActions?.find((e) => e.action === "DISCONNECTION_EXECUTED")
  ) {
    workflowDetails?.data?.nextActions?.forEach((data) => {
      if (data.action == "EDIT") workflowDetails.data.actionState.nextActions.push(data);
    });
  }


  if (applicationDetails?.applicationData?.applicationStatus == "DISCONNECTION_EXECUTED") {
    if (workflowDetails?.data?.actionState?.nextActions) workflowDetails.data.actionState.nextActions = []; 
    if (workflowDetails?.data?.nextActions) workflowDetails.data.nextActions = [];
  }

  workflowDetails?.data?.nextActions?.forEach((action) => {
    if (action?.action === "PAY") {
      action.redirectionUrll = {
        pathname: `${serviceType == "WATER" ? "WS" : "SW"}/${applicationDetails?.applicationData?.connectionNo}/${applicationDetails?.tenantId}?tenantId=${
          applicationDetails?.tenantId
        }&ISWSAPP&applicationNumber=${applicationDetails?.applicationData?.connectionNo}&IsDisconnectionFlow=${true}`,
        state: applicationDetails?.tenantId,
      };
    }
  });

  workflowDetails?.data?.actionState?.nextActions?.forEach((action) => {
    if (action?.action === "PAY") {
      action.redirectionUrll = {
        pathname: `${serviceType == "WATER" ? "WS" : "SW"}/${applicationDetails?.applicationData?.connectionNo}/${applicationDetails?.tenantId}?tenantId=${
          applicationDetails?.tenantId
        }&ISWSAPP&applicationNumber=${applicationDetails?.applicationData?.connectionNo}&IsDisconnectionFlow=${true}`,
        state: applicationDetails?.tenantId,
      };
    }
  });

  workflowDetails?.data?.actionState?.nextActions?.forEach((action) => {
    if (action?.action === "EDIT") {
      let pathName = `/digit-ui/employee/ws/edit-disconnection-application?applicationNumber=${applicationNumber}&service=${serviceType}`;
      const userConfig = servicesMasterData?.["ws-services-masters"]?.WSEditApplicationByConfigUser || [];
      const editApplicationUserRole = userConfig?.[0]?.roles || [];
      const mdmsApplicationStatus = userConfig?.[0]?.status;
      let isFieldInspector = false;
      editApplicationUserRole.every((role, index) => {
        isFieldInspector = ifUserRoleExists(role);
        if (isFieldInspector) return false;
        else return true;
      })
      if (isFieldInspector && appStatus === mdmsApplicationStatus) {
        pathName = `/digit-ui/employee/ws/config-by-disconnection-application?applicationNumber=${applicationNumber}&service=${serviceType}`;
      }
      action.redirectionUrll = {
        action: "ACTIVATE_CONNECTION",
        pathname: pathName,
        state: {
          applicationDetails: applicationDetails,
          action: "VERIFY_AND_FORWARD"
        },
      };
    }
    if (action?.action === "RESUBMIT_APPLICATION") {
      let pathName = `/digit-ui/employee/ws/resubmit-disconnection-application?applicationNumber=${applicationNumber}&service=${serviceType}`;
      action.redirectionUrll = {
        action: "ACTIVATE_CONNECTION",
        pathname: pathName,
        state: {
          applicationDetails: applicationDetails,
          action: "VERIFY_AND_FORWARD"
        },
      };
    }
  });

  const handleDownloadPdf = async () => {
    const tenantInfo = applicationDetails?.applicationData?.tenantId;
    let result = applicationDetails?.applicationData;
    const PDFdata = getPDFData({ ...result }, { ...applicationDetails?.propertyDetails }, tenantInfo, t);
    PDFdata.then((ress) => Digit.Utils.pdf.generatev1(ress));
  };

  async function getDisconnectionNoticeSearch() {
    let key = "ws-waterdisconnectionnotice";
    let details = { WaterConnection: [{ ...applicationDetails?.applicationData, property: applicationDetails.propertyDetails }] }
    if (!applicationDetails?.applicationData?.applicationType?.includes("WATER")) {
      key = "ws-seweragedisconnectionnotice";
      details = { SewerageConnection: [{ ...applicationDetails?.applicationData, property: applicationDetails.propertyDetails }] }
    }
    let response = await Digit.WSService.WSDisconnectionNotice(applicationDetails?.applicationData?.tenantId, details, key);
    const fileStore = await Digit.PaymentService.printReciept(applicationDetails?.applicationData?.tenantId, { fileStoreIds: response.filestoreIds[0] });
    window.open(fileStore[response?.filestoreIds[0]], "_blank");
  }

  const applicationDownloadObject = {
    order: 1,
    label: t("WS_APPLICATION"),
    onClick: handleDownloadPdf,
  };

  const disconnectionNoticeObject = {
    order: 2,
    label: t("WS_DISCONNECTION_NOTICE_LABEL"),
    onClick: () => getDisconnectionNoticeSearch(),
  };

  let dowloadOptions = [];
  switch (appStatus) {
    case "DISCONNECTION_EXECUTED":
    case "PENDING_FOR_PAYMENT":
    case "PENDING_FOR_DISCONNECTION_EXECUTION":
      dowloadOptions = [applicationDownloadObject, disconnectionNoticeObject];
      break;
    default:
      dowloadOptions = [applicationDownloadObject];
      break;
  }

  dowloadOptions.sort(function (a, b) {
    return a.order - b.order;
  });

  return (
    <Fragment>
      <div>
        <div className={"employee-application-details"} style={{ marginBottom: "15px" }}>
          <Header>{t("WS_APPLICATION_DETAILS")} </Header>
          <MultiLink
            className="multilinkWrapper employee-mulitlink-main-div"
            onHeadClick={() => setShowOptions(!showOptions)}
            displayOptions={showOptions}
            options={dowloadOptions}
            downloadBtnClassName={"employee-download-btn-className"}
            optionsClassName={"employee-options-btn-className"}
            ref={menuRef}
          />
        </div>
        <ApplicationDetailsTemplate
          applicationDetails={applicationDetails}
          isLoading={isLoading || isServicesMasterLoading}
          isDataLoading={isLoading || isServicesMasterLoading}
          applicationData={applicationDetails?.applicationData}
          mutate={mutate}
          workflowDetails={workflowDetails}
          businessService={applicationDetails?.processInstancesDetails?.[0]?.businessService?.toUpperCase()}
          moduleCode="WS"
          showToast={showToast}
          setShowToast={setShowToast}
          closeToast={closeToast}
          timelineStatusPrefix={`WF_${applicationDetails?.processInstancesDetails?.[0]?.businessService?.toUpperCase()}_`}
          isInfoLabel={sessionStorage.getItem("isPrivacyEnabled") === "true" ? true : false}
        />
      </div>
    </Fragment>
  );
};

export default GetDisconnectionDetails;
