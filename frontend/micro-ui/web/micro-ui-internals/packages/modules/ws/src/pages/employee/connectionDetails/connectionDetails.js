import React, { useEffect, useState, Fragment, useRef } from "react";
import { useTranslation } from "react-i18next";
import ApplicationDetailsTemplate from "../../../../../templates/ApplicationDetails";
import { useHistory } from "react-router-dom";
import { Header, ActionBar, MultiLink, SubmitBar, Menu, Modal, ButtonSelector, Toast } from "@egovernments/digit-ui-react-components";
import * as func from "../../../utils";
import { ifUserRoleExists, downloadPdf, downloadAndOpenPdf } from "../../../utils";
import WSInfoLabel from "../../../pageComponents/WSInfoLabel";
import getConnectionDetailsPDF from "../../../utils/getConnectionDetails";

const GetConnectionDetails = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const history = useHistory();
  const [displayMenu, setDisplayMenu] = useState(false);
  const [showToast, setShowToast] = useState(null);
  let filters = func.getQueryStringParams(location.search);
  const applicationNumber = filters?.applicationNumber;
  const serviceType = filters?.service;
  const due = filters?.due;
  const getTenantId = filters?.tenantId;
  const connectionType = filters?.connectionType;
  const [showOptions, setShowOptions] = useState(false);
  const stateCode = Digit.ULBService.getStateId();
  const actionConfig = ["MODIFY_CONNECTION_BUTTON", "BILL_AMENDMENT_BUTTON", "DISCONNECTION_BUTTON"];
  const { isLoading, isError, data: applicationDetails, error } = Digit.Hooks.ws.useConnectionDetail(t, tenantId, applicationNumber, serviceType, {
    privacy: Digit.Utils.getPrivacyObject(),
  });
  const menuRef = useRef();
  const actionMenuRef = useRef();
  sessionStorage.removeItem("IsDetailsExists");
  Digit.SessionStorage.del("PT_CREATE_EMP_WS_NEW_FORM");

  const { isLoading: isLoadingDemand, data: demandData } = Digit.Hooks.useDemandSearch(
    { consumerCode: applicationDetails?.applicationData?.connectionNo, businessService: serviceType === "WATER" ? "WS" : "SW", tenantId },
    { enabled: !!applicationDetails?.applicationData?.applicationNo }
  );

  const [showModal, setshowModal] = useState(false);
  const [billData, setBilldata] = useState([]);
  const [showActionToast, setshowActionToast] = useState(null);
  const checkifPrivacyenabled = Digit.Hooks.ws.useToCheckPrivacyEnablement({privacy : { uuid:(applicationDetails?.applicationData?.applicationNo?.includes("WS") ? applicationDetails?.applicationData?.WaterConnection?.[0]?.connectionHolders?.[0]?.uuid : applicationDetails?.applicationData?.SewerageConnections?.[0]?.connectionHolders?.[0]?.uuid), fieldName: ["connectionHoldersMobileNumber"], model: "WnSConnectionOwner" }}) || false;

  const {
    isLoading: updatingApplication,
    isError: updateApplicationError,
    data: updateResponse,
    error: updateError,
    mutate,
  } = Digit.Hooks.ws.useWSApplicationActions(serviceType);
  const mobileView = Digit.Utils.browser.isMobile();

  const { isCommonmastersLoading, data: mdmsCommonmastersData } = Digit.Hooks.obps.useMDMS(stateCode, "common-masters", ["uiCommonPay"]);
  const commonPayDetails = mdmsCommonmastersData?.["common-masters"]?.uiCommonPay || [];
  const index =
    commonPayDetails &&
    commonPayDetails.findIndex((item) => {
      return item.code == "WS.ONE_TIME_FEE";
    });
  let commonPayInfo = "";
  if (index > -1) commonPayInfo = commonPayDetails[index];
  else commonPayInfo = commonPayDetails && commonPayDetails.filter((item) => item.code === "DEFAULT");
  const receiptKey = commonPayInfo?.receiptKey || "consolidatedreceipt";

  useEffect(async () => {
    let businessService = serviceType === "WATER" ? "WS" : "SW";
    const res = await Digit.PaymentService.searchAmendment(tenantId, { consumerCode: applicationNumber, businessService });

    setBilldata(res.Amendments);
  }, []);

  const downloadConnectionDetails = async () => {
    const tenantInfo = applicationDetails?.applicationData?.tenantId;
    let result = applicationDetails?.applicationData;
    const PDFdata = getConnectionDetailsPDF({ ...result }, { ...applicationDetails?.propertyDetails }, tenantInfo, t);
    PDFdata.then((ress) => Digit.Utils.pdf.generatev1(ress));
  };

  const downloadApplicationDetails = async () => {
    const res = { ...applicationDetails };
    const tenantInfo = res?.tenantId;
    const PDFdata = getPDFData({ ...res }, { ...res?.property }, tenantInfo, t);
    PDFdata.then((ress) => Digit.Utils.pdf.generate(ress));
  };

  const closeToast = () => {
    setShowToast(null);
  };

  const closeBillToast = () => {
    setshowActionToast(null);
  };
  setTimeout(() => {
    closeBillToast();
  }, 10000);

  const checkApplicationStatus = applicationDetails?.applicationData?.status === "Active" ? true : false;
  const checkWorkflow = applicationDetails?.isApplicationApproved;

  const getModifyConnectionButton = () => {
    if (!checkApplicationStatus) {
      setshowActionToast({
        key: "error",
        label: "CONN_NOT_ACTIVE",
      });
      return;
    }
    if (applicationDetails?.fetchBillsData[0]?.totalAmount > 0) {
      setshowActionToast({
        key: "error",
        label: "WS_DUE_AMOUNT_SHOULD_BE_ZERO",
      });
      return;
    }
    //here check if this connection have any active bills(don't allow to modify in this case)

    let pathname = `/digit-ui/employee/ws/modify-application?applicationNumber=${applicationDetails?.applicationData?.connectionNo}&service=${serviceType}&propertyId=${applicationDetails?.propertyDetails?.propertyId}&from=WS_COMMON_CONNECTION_DETAIL`;

    history.push(`${pathname}`, JSON.stringify({ data: applicationDetails }));
  };

  const getBillAmendmentButton = () => {
    //redirect to documents required screen here instead of this screen

    let isBillAmendNotApplicable = false;
    billData?.map((bill) => {
      if (bill?.status === "INWORKFLOW") {
        isBillAmendNotApplicable = true;
        return;
      }
    });

    if (demandData?.Demands?.length === 0) {
      setshowActionToast({
        key: "error",
        label: "No_Bills_Found",
      });
      return;
    } else if (isBillAmendNotApplicable) {
      setshowActionToast({
        key: "error",
        label: "WORKFLOW_IN_PROGRESS",
      });
      return;
    }

    history.push(
      `/digit-ui/employee/ws/required-documents?connectionNumber=${applicationDetails?.applicationData?.connectionNo}&tenantId=${getTenantId}&service=${serviceType}`,
      JSON.stringify({ data: applicationDetails })
    );
  };

  const closeMenu = () => {
    setShowOptions(false);
  };
  Digit.Hooks.useClickOutside(menuRef, closeMenu, showOptions);

  const closeActionMenu = () => {
    setDisplayMenu(false);
  };
  Digit.Hooks.useClickOutside(actionMenuRef, closeActionMenu, displayMenu);

  const getDisconnectionButton = () => {
    let pathname = `/digit-ui/employee/ws/new-disconnection`;

    if(!checkWorkflow){
      setshowActionToast({
        key: "error",
        label: "WORKFLOW_IN_PROGRESS",
      });
    }
    else{
        if (billData[0]?.status === "ACTIVE" || applicationDetails?.fetchBillsData?.length <=0 || due === "0") {
          Digit.SessionStorage.set("WS_DISCONNECTION", applicationDetails);
          history.push(`${pathname}`);
        } else {
          setshowModal(true);
        }
    }
  };
  function onActionSelect(action) {
    if (action === "MODIFY_CONNECTION_BUTTON") {
      getModifyConnectionButton();
    } else if (action === "BILL_AMENDMENT_BUTTON") {
      getBillAmendmentButton();
    } else if (action === "DISCONNECTION_BUTTON") {
      getDisconnectionButton();
    }
  }

  //all options needs to be shown
  //const showAction = due !== "0" ? actionConfig : actionConfig.filter((item) => item !== "BILL_AMENDMENT_BUTTON");
  const checkApplicationStatusForDisconnection =  applicationDetails?.applicationData?.status === "Active" ? true : false
  const showAction= checkApplicationStatusForDisconnection ? actionConfig : actionConfig.filter((item) => item !== "DISCONNECTION_BUTTON");


  async function getBillSearch() {
    if (applicationDetails?.fetchBillsData?.length > 0) {
      const service = serviceType === "WATER" ? "WS" : "SW";
      let wsSearchFilters = {
        isConnectionSearch: true,
        connectionNumber: applicationDetails?.applicationData?.connectionNo,
      };
      const wsConnectionDetails = await Digit.WSService.search({ tenantId, filters: wsSearchFilters, businessService: service });
      let filters = {
        applicationNumber:
          serviceType === "WATER"
            ? wsConnectionDetails?.WaterConnection?.[0]?.applicationNo
            : wsConnectionDetails?.SewerageConnections?.[0]?.applicationNo,
        bussinessService: service,
      };
      if (wsConnectionDetails?.WaterConnection?.length > 0 || wsConnectionDetails?.SewerageConnections?.length > 0) {
        downloadAndOpenPdf(applicationDetails?.applicationData?.connectionNo, filters);
      }
    }
  }

  let dowloadOptions = [];

  const appFeeDownloadReceipt = {
    order: 1,
    label: t("WS_COMMON_DOWNLOAD_BILL"),
    onClick: () => getBillSearch(),
  };

  const connectionDetailsReceipt = {
    order: 2,
    label: t("WS_CONNECTION_DETAILS_RECEIPT"),
    onClick: () => downloadConnectionDetails(),
  };

  if (applicationDetails?.fetchBillsData?.length > 0) dowloadOptions = [appFeeDownloadReceipt, connectionDetailsReceipt];
  else dowloadOptions = [connectionDetailsReceipt];
  const Close = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF">
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
    </svg>
  );
  const Heading = (props) => {
    return (
      <h1 style={{ marginLeft: "22px" }} className="heading-m BPAheading-m">
        {props.label}
      </h1>
    );
  };

  const CloseBtn = (props) => {
    return (
      <div className="icon-bg-secondary" onClick={props.onClick}>
        <Close />
      </div>
    );
  };

  return (
    <Fragment>
      <div>
        <div className={"employee-application-details"} style={{ marginBottom: "15px" }}>
          <Header styles={{ marginLeft: "0px", paddingTop: "10px", fontSize: "32px" }}>{t("WS_CONNECTION_DETAILS")}</Header>
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
          isLoading={isLoading}
          isDataLoading={isLoading}
          applicationData={applicationDetails?.applicationData}
          mutate={mutate}
          businessService={applicationDetails?.processInstancesDetails?.[0]?.businessService}
          moduleCode="WS"
          showToast={showToast}
          setShowToast={setShowToast}
          closeToast={closeToast}
          isInfoLabel={checkifPrivacyenabled}
          labelComponent={<WSInfoLabel t={t} />}
        />
        {ifUserRoleExists("WS_CEMP") && checkApplicationStatus && !applicationDetails?.isDisconnectionDone ? (
          <ActionBar>
            {displayMenu ? <Menu options={showAction} localeKeyPrefix={"WS"} t={t} onSelect={onActionSelect} /> : null}

            <SubmitBar ref={actionMenuRef} label={t("WF_TAKE_ACTION")} onSubmit={() => setDisplayMenu(!displayMenu)} />
          </ActionBar>
        ) : null}
        {showModal ? (
          <Modal
            open={showModal}
            headerBarMain={<Heading label={t("WS_PENDING_DUES_LABEL")} />}
            headerBarEnd={<CloseBtn onClick={() => setshowModal(false)} />}
            center
            formId="modal-action"
            actionCancelOnSubmit={() => setshowModal(false)}
            actionCancelLabel={t(`${"CS_COMMON_CANCEL"}`)}
            actionSaveLabel={t(`${"WS_COMMON_COLLECT_LABEL"}`)}
            actionSaveOnSubmit={() => {
              history.push(
                `/digit-ui/employee/payment/collect/${serviceType === "WATER" ? "WS" : "SW"}/${encodeURIComponent(
                  applicationNumber
                )}/${getTenantId}?tenantId=${getTenantId}&ISWSCON`
              );
              setshowModal(false);
            }}
            popupStyles={mobileView ? { width: "720px" } : {}}
            style={
              !mobileView
                ? { minHeight: "45px", height: "auto", width: "107px", paddingLeft: "0px", paddingRight: "0px" }
                : { minHeight: "45px", height: "auto", width: "44%" }
            }
            popupModuleMianStyles={mobileView ? { paddingLeft: "5px" } : {}}
          >
            <div className="modal-header-ws">{t("WS_CLEAR_DUES_DISCONNECTION_SUB_HEADER_LABEL")} </div>
            <div className="modal-body-ws">
              <span>
                {t("WS_COMMON_TABLE_COL_AMT_DUE_LABEL")}: ₹{due?due:applicationDetails?.fetchBillsData?.[0]?.totalAmount}
              </span>
            </div>
          </Modal>
        ) : null}
        {showActionToast && <Toast error={showActionToast.key} label={t(`${showActionToast.label}`)} onClose={closeBillToast} />}
      </div>
    </Fragment>
  );
};

export default GetConnectionDetails;
