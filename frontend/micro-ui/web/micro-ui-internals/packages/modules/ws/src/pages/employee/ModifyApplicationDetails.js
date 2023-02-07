import React, { useState, Fragment, useRef } from "react";
import { Header, MultiLink } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import ApplicationDetailsTemplate from "../../../../templates/ApplicationDetails";
import * as func from "../../utils";
import getModifyPDFData from "../../utils/getWsAckDataForModifyPdfs"
import { getBusinessService } from "../../utils";
import _ from "lodash";
import { ifUserRoleExists } from "../../utils";

const ModifyApplicationDetails = () => {
  const { t } = useTranslation();
  const userInfo = Digit.UserService.getUser();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const [showToast, setShowToast] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  let filters = func.getQueryStringParams(location.search);
  const applicationNumber = filters?.applicationNumber;
  const serviceType = filters?.service;
  const stateCode = Digit.ULBService.getStateId();
  const menuRef = useRef();

  let { isLoading, isError, data: applicationDetails, error } = Digit.Hooks.ws.useWSModifyDetailsPage(t, tenantId, applicationNumber, serviceType, userInfo, { privacy: Digit.Utils.getPrivacyObject() });
  const { isServicesMasterLoading, data: servicesMasterData } = Digit.Hooks.ws.useMDMS(stateCode, "ws-services-masters", ["WSEditApplicationByConfigUser"]);

  let workflowDetails = Digit.Hooks.useWorkflowDetails(
    {
      tenantId: tenantId,
      id: applicationNumber,
      moduleCode: applicationDetails?.processInstancesDetails?.[0]?.businessService,
      config: {
        enabled: applicationDetails?.processInstancesDetails?.[0]?.businessService ? true : false,
        privacy: Digit.Utils.getPrivacyObject()
      }
    },
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
  };

  const checkWSAdditionalDetails = () => {
    const connectionType = applicationDetails?.applicationData?.connectionType;
    const noOfTaps = applicationDetails?.applicationData?.noOfTaps === 0 ? null : applicationDetails?.applicationData?.noOfTaps;
    const pipeSize = applicationDetails?.applicationData?.pipeSize === 0 ? null : applicationDetails?.applicationData?.pipeSize;
    const waterSource = applicationDetails?.applicationData?.waterSource;
    const noOfWaterClosets = applicationDetails?.applicationData?.noOfWaterClosets === 0 ? null : applicationDetails?.applicationData?.noOfWaterClosets;
    const noOfToilets = applicationDetails?.applicationData?.noOfToilets === 0 ? null : applicationDetails?.applicationData?.noOfToilets;
    const plumberDetails = applicationDetails?.applicationData?.additionalDetails?.detailsProvidedBy;
    const roadCuttingInfo = applicationDetails?.applicationData?.roadCuttingInfo;

    if (!connectionType || !((noOfTaps && pipeSize && waterSource) || (noOfWaterClosets && noOfToilets)) || !plumberDetails || !roadCuttingInfo) {
      return false
    }
    return true;
  }
  let dowloadOptions = [],
    appStatus = applicationDetails?.applicationData?.applicationStatus || "";

  workflowDetails?.data?.actionState?.nextActions?.forEach((action) => {
    if (action?.action === "ACTIVATE_CONNECTION") {
      action.redirectionUrll = {
        action: "ACTIVATE_CONNECTION",
        pathname: `/digit-ui/employee/ws/activate-connection?applicationNumber=${applicationNumber}&service=${serviceType}&action=ACTIVATE_CONNECTION`,
        state: applicationDetails?.applicationData,
      };
    }
    if (action?.action === "RESUBMIT_APPLICATION") {
      let pathName = `/digit-ui/employee/ws/edit-application?applicationNumber=${applicationNumber}&service=${serviceType}&propertyId=${applicationDetails?.propertyDetails?.propertyId}`;

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
        pathName = `/digit-ui/employee/ws/edit-application-by-config?applicationNumber=${applicationNumber}&service=${serviceType}&propertyId=${applicationDetails?.propertyDetails?.propertyId}`;
      }

      action.redirectionUrll = {
        action: "ACTIVATE_CONNECTION",
        pathname: pathName,
        state: {
          applicationDetails: applicationDetails,
          action: "RESUBMIT_APPLICATION"
        },
      };
    }
    if (action?.action === "SUBMIT_APPLICATION") {
      action.redirectionUrll = {
        action: "ACTIVATE_CONNECTION",
        pathname: `/digit-ui/employee/ws/modify-application-edit?applicationNumber=${applicationNumber}&service=${serviceType}&propertyId=${applicationDetails?.propertyDetails?.propertyId}`,
        state: applicationDetails,
      };
    }
  });

  if (
    workflowDetails?.data?.nextActions?.length > 0 &&
    workflowDetails?.data?.actionState?.nextActions?.length > 0 &&
    !workflowDetails?.data?.actionState?.nextActions?.find((e) => e.action === "EDIT") &&
    !workflowDetails?.data?.actionState?.nextActions?.find((e) => e.action === "RESUBMIT_APPLICATION") &&
    !workflowDetails?.data?.actionState?.nextActions?.find((e) => e.action === "ACTIVATE_CONNECTION") &&
    !workflowDetails?.data?.actionState?.nextActions?.find((e) => e.action === "SUBMIT_APPLICATION")
  ) {
    workflowDetails?.data?.nextActions?.forEach((data) => {
      if (data.action == "EDIT") workflowDetails.data.actionState.nextActions.push(data);
    });
  }

  workflowDetails?.data?.actionState?.nextActions?.forEach((action) => {
    if (action?.action === "EDIT") {
      let pathName = `/digit-ui/employee/ws/edit-application?applicationNumber=${applicationNumber}&service=${serviceType}&propertyId=${applicationDetails?.propertyDetails?.propertyId}`;

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
        pathName = `/digit-ui/employee/ws/edit-application-by-config?applicationNumber=${applicationNumber}&service=${serviceType}&propertyId=${applicationDetails?.propertyDetails?.propertyId}`;
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
  });

  workflowDetails?.data?.nextActions?.forEach((action) => {
    if (action?.action === "VERIFY_AND_FORWARD" && appStatus === "PENDING_FOR_FIELD_INSPECTION" && !checkWSAdditionalDetails()) {
      action.isToast = true;
      action.toastMessage = "MISSING_ADDITIONAL_DETAILS";
    }
  });

  workflowDetails?.data?.actionState?.nextActions?.forEach((action) => {
    if (action?.action === "VERIFY_AND_FORWARD" && appStatus === "PENDING_FOR_FIELD_INSPECTION" && !checkWSAdditionalDetails()) {
      action.isToast = true;
      action.toastMessage = "MISSING_ADDITIONAL_DETAILS";
    }
  });
  workflowDetails?.data?.nextActions?.forEach((action) => {
    if (action?.action === "PAY") {
      action.redirectionUrll = {
        pathname: `${getBusinessService(filters)}/${applicationDetails?.applicationNo}/${applicationDetails?.tenantId}?tenantId=${applicationDetails?.tenantId
          }&ISWSAPP&applicationNumber=${applicationDetails?.applicationNo}`,
        state: applicationDetails?.tenantId,
      };
    }
  });

  workflowDetails?.data?.actionState?.nextActions?.forEach((action) => {
    if (action?.action === "PAY") {
      action.redirectionUrll = {
        pathname: `${getBusinessService(filters)}/${applicationDetails?.applicationNo}/${applicationDetails?.tenantId}?tenantId=${applicationDetails?.tenantId
          }&ISWSAPP&applicationNumber=${applicationDetails?.applicationNo}`,
        state: applicationDetails?.tenantId,
      };
    }
  });

  const handleDownloadPdf = async () => {
    const tenantInfo = applicationDetails?.applicationData?.tenantId;
    let result = applicationDetails?.applicationData;
    let oldApplication = applicationDetails?.oldApplication;
    const PDFdata = getModifyPDFData({ ...result }, { ...applicationDetails?.propertyDetails }, tenantInfo, t, oldApplication)
    PDFdata.then((ress) => Digit.Utils.pdf.generateModifyPdf(ress))
  };

  const applicationDownloadObject = {
    order: 3,
    label: t("WS_APPLICATION"),
    onClick: handleDownloadPdf,
  };

  switch (appStatus) {
    case "REJECTED":
      dowloadOptions = [applicationDownloadObject];
      break;

    default:
      dowloadOptions = [applicationDownloadObject];
      break;
  }

  const closeMenu = () => {
    setShowOptions(false);
  }
  Digit.Hooks.useClickOutside(menuRef, closeMenu, showOptions);

  dowloadOptions.sort(function (a, b) {
    return a.order - b.order;
  });

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
              ref={menuRef}
            />
          )}
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

export default ModifyApplicationDetails;
