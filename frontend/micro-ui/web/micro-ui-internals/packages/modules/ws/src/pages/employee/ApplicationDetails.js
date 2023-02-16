import React, { useState, Fragment, useEffect, useRef } from "react";
import {
  FormComposer,
  Header,
  Card,
  CardSectionHeader,
  PDFSvg,
  Loader,
  StatusTable,
  Row,
  ActionBar,
  SubmitBar,
  MultiLink,
  Toast
} from "@egovernments/digit-ui-react-components";
import { useParams, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ApplicationDetailsTemplate from "../../../../templates/ApplicationDetails";
import get from "lodash/get";
import orderBy from "lodash/orderBy";
import cloneDeep from "lodash/cloneDeep";
import * as func from "../../utils";
import getPDFData from "../../utils/getWSAcknowledgementData";
import getModifyPDFData from "../../utils/getWsAckDataForModifyPdfs"
import { getFiles, getBusinessService } from "../../utils";
import _ from "lodash";
import { ifUserRoleExists } from "../../utils";
import WSInfoLabel from "../../pageComponents/WSInfoLabel";
const ApplicationDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const userInfo = Digit.UserService.getUser();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const stateCode = Digit.ULBService.getStateId();
  const [showToast, setShowToast] = useState(null);
  const [showWaringToast, setShowWaringToast] = useState(null);
  const [canSubmit, setSubmitValve] = useState(false);
  const defaultValues = {};
  const history = useHistory();
  const stateId = Digit.ULBService.getStateId();
  const isMobile = window.Digit.Utils.browser.isMobile();
  const [showOptions, setShowOptions] = useState(false);
  let filters = func.getQueryStringParams(location.search);
  const applicationNumber = filters?.applicationNumber;
  const serviceType = filters?.service;
  const menuRef = useRef();

  sessionStorage.removeItem("Digit.PT_CREATE_EMP_WS_NEW_FORM");
  sessionStorage.removeItem("IsDetailsExists");

  const [sessionFormData, setSessionFormData, clearSessionFormData] = Digit.Hooks.useSessionStorage("ADHOC_ADD_REBATE_DATA", {});
  const [sessionBillFormData, setSessionBillFormData, clearBillSessionFormData] = Digit.Hooks.useSessionStorage("ADHOC_BILL_ADD_REBATE_DATA", {});
  //for common receipt key.
  const { isBillingServiceLoading, data: mdmsBillingServiceData } = Digit.Hooks.obps.useMDMS(stateCode, "BillingService", ["BusinessService"]);
  const { isCommonmastersLoading, data: mdmsCommonmastersData } = Digit.Hooks.obps.useMDMS(stateCode, "common-masters", ["uiCommonPay"]);
  const { isServicesMasterLoading, data: servicesMasterData } = Digit.Hooks.ws.useMDMS(stateCode, "ws-services-masters", ["WSEditApplicationByConfigUser"]);
  const commonPayDetails = mdmsCommonmastersData?.["common-masters"]?.uiCommonPay || [];
  const index = commonPayDetails && commonPayDetails.findIndex((item) => { return item.code == "WS.ONE_TIME_FEE"; });
  let commonPayInfo = "";
  if (index > -1) commonPayInfo = commonPayDetails[index];
  else commonPayInfo = commonPayDetails && commonPayDetails.filter(item => item.code === "DEFAULT");
  const receiptKey = commonPayInfo?.receiptKey || "consolidatedreceipt";

  const { isLoading: isPrivacyLoading, data : privacyData } = Digit.Hooks.useCustomMDMS(
    Digit.ULBService.getStateId(),
    "DataSecurity",
    [{ name: "SecurityPolicy" }],
    {
      select: (data) => data?.DataSecurity?.SecurityPolicy?.find((elem) => elem?.model == "User") || {},
    }
  );
  
  

  let { isLoading, isError, data: applicationDetails, error } = Digit.Hooks.ws.useWSDetailsPage(t, tenantId, applicationNumber, serviceType, userInfo,{ privacy: Digit.Utils.getPrivacyObject() });

  function checkforPrivacyenablement(){
    if(!isLoading && Digit.Utils.checkPrivacy(privacyData, { uuid:applicationDetails?.applicationData?.connectionHolders?.uuid || applicationDetails?.propertyDetails?.owners?.[0]?.uuid, fieldName: "mobileNumber", model: "User" }))
    return true
    else
    return false
  }

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
  

  const { data: reciept_data, isLoading: recieptDataLoading } = Digit.Hooks.useRecieptSearch(
    {
      tenantId: tenantId,
      businessService:  serviceType == "WATER" ? "WS.ONE_TIME_FEE" : "SW.ONE_TIME_FEE",
      consumerCodes: applicationDetails?.applicationData?.applicationNo
    },
    {
      enabled: applicationDetails?.applicationData?.applicationType?.includes("NEW_")?true:false,
      privacy: Digit.Utils.getPrivacyObject()
    },
  );

  const { data: oldData } = Digit.Hooks.ws.useOldValue({
    tenantId,
    filters: { connectionNumber: applicationDetails?.applicationData?.connectionNo, isConnectionSearch: true },
    businessService: serviceType
  },{
    enabled: applicationDetails?.applicationData?.applicationType?.includes("MODIFY_") ? true : false,
    privacy: Digit.Utils.getPrivacyObject()
  });
  sessionStorage.removeItem("eyeIconClicked");
  const oldValueWC = oldData?.WaterConnection;
  const oldValueSC = oldData?.SewerageConnections;

  const oldValueCopy = [oldValueWC, oldValueSC];

  const newValueFilter = oldValueCopy?.filter((ele) => ele);

  const currentValue = applicationDetails?.applicationData;
  const res = newValueFilter[0]?.flatMap((o) => {
    const pairs = Object.entries(o).filter(([k, v]) => currentValue?.[k] !== v);
    return pairs?.length ? Object.fromEntries(pairs) : [];
  });
  
  const {
    isLoading: updatingApplication,
    isError: updateApplicationError,
    data: updateResponse,
    error: updateError,
    mutate,
  } = Digit.Hooks.ws.useWSApplicationActions(serviceType);

  const clearDataDetails = () => {
    clearSessionFormData();
    setSessionFormData({});
    setSessionBillFormData({});
    clearBillSessionFormData()
  }

  const closeToast = () => {
    setShowToast(null);
  };

  const closeWaringToast = () => {
    setShowWaringToast(null);
  }

  const checkWSAdditionalDetails = () => {
    const connectionType = applicationDetails?.applicationData?.connectionType;
    const noOfTaps = applicationDetails?.applicationData?.noOfTaps === 0 ? null : applicationDetails?.applicationData?.noOfTaps;
    const pipeSize = applicationDetails?.applicationData?.pipeSize === 0 ? null : applicationDetails?.applicationData?.pipeSize;
    const waterSource =  applicationDetails?.applicationData?.waterSource;
    const noOfWaterClosets = applicationDetails?.applicationData?.noOfWaterClosets === 0 ? null : applicationDetails?.applicationData?.noOfWaterClosets;
    const noOfToilets = applicationDetails?.applicationData?.noOfToilets === 0 ? null : applicationDetails?.applicationData?.noOfToilets;
    const plumberDetails = applicationDetails?.applicationData?.additionalDetails?.detailsProvidedBy;
    const roadCuttingInfo = applicationDetails?.applicationData?.roadCuttingInfo;

    if( !connectionType || !((noOfTaps && pipeSize && waterSource) || (noOfWaterClosets && noOfToilets)) || !plumberDetails || !roadCuttingInfo){
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
        if(isFieldInspector) return false;
        else return true;
      })

      if(isFieldInspector && appStatus === mdmsApplicationStatus) {
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
        if(isFieldInspector) return false;
        else return true;
      })

      if(isFieldInspector && appStatus === mdmsApplicationStatus) {
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
    if(action?.action === "VERIFY_AND_FORWARD" && appStatus === "PENDING_FOR_FIELD_INSPECTION" && !checkWSAdditionalDetails()){
      action.isToast = true;
      action.toastMessage = "MISSING_ADDITIONAL_DETAILS";
    }
  });

  workflowDetails?.data?.actionState?.nextActions?.forEach((action) => {
    if(action?.action === "VERIFY_AND_FORWARD" && appStatus === "PENDING_FOR_FIELD_INSPECTION" && !checkWSAdditionalDetails()){
      action.isToast = true;
      action.toastMessage = "MISSING_ADDITIONAL_DETAILS";
    }
  });
  workflowDetails?.data?.nextActions?.forEach((action) => {
    if (action?.action === "PAY") {
      action.redirectionUrll = {
        pathname: `${getBusinessService(filters)}/${applicationDetails?.applicationNo}/${applicationDetails?.tenantId}?tenantId=${
          applicationDetails?.tenantId
        }&ISWSAPP&applicationNumber=${applicationDetails?.applicationNo}`,
        state: applicationDetails?.tenantId,
      };
    }
  });

  workflowDetails?.data?.actionState?.nextActions?.forEach((action) => {
    if (action?.action === "PAY") {
      action.redirectionUrll = {
        pathname: `${getBusinessService(filters)}/${applicationDetails?.applicationNo}/${applicationDetails?.tenantId}?tenantId=${
          applicationDetails?.tenantId
        }&ISWSAPP&applicationNumber=${applicationDetails?.applicationNo}`,
        state: applicationDetails?.tenantId,
      };
    }
  });

  const oldApplication = serviceType === "WATER" ? oldData?.WaterConnection?.[oldData?.WaterConnection?.length - 1] : oldData?.SewerageConnections?.[oldData?.SewerageConnections?.length - 1]

  const handleDownloadPdf = async () => {
    const tenantInfo = applicationDetails?.applicationData?.tenantId;
    let result = applicationDetails?.applicationData;
  
    if (applicationDetails?.applicationData?.applicationType?.includes("MODIFY_")){
      const PDFdata = getModifyPDFData({ ...result }, { ...applicationDetails?.propertyDetails }, tenantInfo, t, oldApplication)
      PDFdata.then((ress) => Digit.Utils.pdf.generateModifyPdf(ress))
      return
    }
    const PDFdata = getPDFData({ ...result }, { ...applicationDetails?.propertyDetails }, tenantInfo, t);
    PDFdata.then((ress) => Digit.Utils.pdf.generatev1(ress));
  };

  async function getRecieptSearch(tenantId, payments, consumerCodes, receiptKey) {
    let response = await Digit.PaymentService.generatePdf(tenantId, { Payments: [{...payments}] }, receiptKey);
    const fileStore = await Digit.PaymentService.printReciept(tenantId, { fileStoreIds: response.filestoreIds[0] });
    window.open(fileStore[response?.filestoreIds[0]], "_blank");
  }

  const handleEstimateDownload = async () => {
    if (applicationDetails?.applicationData?.additionalDetails?.estimationFileStoreId) {
      getFiles([applicationDetails?.applicationData?.additionalDetails?.estimationFileStoreId], stateCode)
    } else {
      const warningCount = sessionStorage.getItem("WARINIG_COUNT") || "0";
      const warningCountDetails = JSON.parse(warningCount);
      if(warningCountDetails == 0) {
        const filters = { applicationNumber };
        const response = await Digit.WSService.search({tenantId : tenantId, filters: { ...filters }, businessService: serviceType == "WATER" ? "WS" : "SW"})
        let details = serviceType == "WATER" ? response?.WaterConnection?.[0] : response?.SewerageConnections?.[0];
        if (details?.additionalDetails?.estimationFileStoreId) {
          getFiles([details?.additionalDetails?.estimationFileStoreId], stateCode)
        } else {
          sessionStorage.setItem("WARINIG_COUNT", warningCountDetails ? warningCountDetails + 1 : 1);
          setTimeout(() => {
            sessionStorage.setItem("WARINIG_COUNT", "0");
          }, 60000);
          setShowWaringToast({ isError: false, isWarning: true, key: "warning", message: t("WS_WARNING_FILESTOREID_PLEASE_TRY_AGAIN_SOMETIME_LABEL") });
        }
      } else if(!showWaringToast) {
        setShowWaringToast({ isError: false, isWarning: true, key: "warning", message: t("WS_WARNING_FILESTOREID_PLEASE_TRY_AGAIN_SOMETIME_LABEL") });
      }
    }

  }

  const wsEstimateDownloadObject = {
    order: 1,
    label: t("WS_ESTIMATION_NOTICE"),
    onClick: handleEstimateDownload,
  };

  const sanctionDownloadObject = {
    order: 2,
    label: t("WS_SANCTION_LETTER"),
    onClick: () => getFiles([applicationDetails?.applicationData?.additionalDetails?.sanctionFileStoreId], stateCode),
  };

  const applicationDownloadObject = {
    order: 3,
    label: t("WS_APPLICATION"),
    onClick: handleDownloadPdf,
  };

  const appFeeDownloadReceipt = {
    order: 4,
    label: t("DOWNLOAD_RECEIPT_HEADER"),
    onClick: () => getRecieptSearch(applicationDetails?.applicationData?.tenantId ? applicationDetails?.applicationData?.tenantId : Digit.ULBService.getCurrentTenantId(), reciept_data?.Payments?.[0], applicationDetails?.applicationData?.applicationNo, receiptKey ),
  };
  
  const applicationFeeReceipt = {
    order: 4,
    label: t("WS_APLICATION_RECEIPT"),
    onClick: async () => {
      const ConnectionDetailsfile = await Digit.PaymentService.generatePdf(tenantId, { WaterConnection: [applicationDetails?.applicationData] }, "ws-consolidatedacknowlegment");
      const file = await Digit.PaymentService.printReciept(tenantId, { fileStoreIds: ConnectionDetailsfile.filestoreIds[0] });
      window.open(file[ConnectionDetailsfile.filestoreIds[0]], "_blank");
    }
  };

  switch (appStatus) {
    case "PENDING_FOR_DOCUMENT_VERIFICATION":
    case "PENDING_FOR_CITIZEN_ACTION":
    case "PENDING_FOR_FIELD_INSPECTION":
      dowloadOptions = [applicationDownloadObject];
      break;
    case "PENDING_APPROVAL_FOR_CONNECTION":
    case "PENDING_FOR_PAYMENT":
      dowloadOptions = [applicationDownloadObject, wsEstimateDownloadObject];
      break;
    case "PENDING_FOR_CONNECTION_ACTIVATION":
    case "CONNECTION_ACTIVATED":
      if (applicationDetails?.applicationData?.applicationType?.includes("NEW_") && reciept_data?.Payments?.length > 0) dowloadOptions = [sanctionDownloadObject, wsEstimateDownloadObject, applicationDownloadObject, appFeeDownloadReceipt]; 
      else dowloadOptions = [sanctionDownloadObject, wsEstimateDownloadObject, applicationDownloadObject];
      break;
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
  Digit.Hooks.useClickOutside(menuRef, closeMenu, showOptions );

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
          isLoading={isLoading || isBillingServiceLoading || isCommonmastersLoading || isServicesMasterLoading }
          isDataLoading={isLoading || isBillingServiceLoading || isCommonmastersLoading || isServicesMasterLoading }
          applicationData={applicationDetails?.applicationData}
          mutate={mutate}
          workflowDetails={workflowDetails}
          businessService={applicationDetails?.processInstancesDetails?.[0]?.businessService?.toUpperCase()}
          moduleCode="WS"
          showToast={showToast}
          setShowToast={setShowToast}
          closeToast={closeToast}
          timelineStatusPrefix={`WF_${applicationDetails?.processInstancesDetails?.[0]?.businessService?.toUpperCase()}_`}
          oldValue={res}
          isInfoLabel={checkforPrivacyenablement()}
          clearDataDetails={clearDataDetails}
        />
        {showWaringToast &&
          <Toast
            style={{ zIndex: "10000" }}
            warning={showWaringToast?.isWarning}
            error={showWaringToast?.isWarning ? false : true}
            label={t(showWaringToast?.message)}
            onClose={closeWaringToast}
            isDleteBtn={true}
          />}
      </div>
    </Fragment>
  );
};

export default ApplicationDetails;
