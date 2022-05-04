import React, { useEffect, useState, Fragment } from "react";
import { useTranslation } from "react-i18next";
import ApplicationDetailsTemplate from "../../../../../templates/ApplicationDetails";
import { useHistory } from "react-router-dom";
import { Header, ActionBar, MultiLink, SubmitBar, Menu, Modal, ButtonSelector, Toast } from "@egovernments/digit-ui-react-components";
import * as func from "../../../utils";
import { ifUserRoleExists } from "../../../utils";
import WSInfoLabel from "../../../pageComponents/WSInfoLabel";

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
  const { isLoading, isError, data: applicationDetails, error } = Digit.Hooks.ws.useConnectionDetail(t, tenantId, applicationNumber, serviceType);
  const [showModal, setshowModal] = useState(false);
  const [billData, setBilldata] = useState([]);
  const [showActionToast, setshowActionToast] = useState(null);

  const {
    isLoading: updatingApplication,
    isError: updateApplicationError,
    data: updateResponse,
    error: updateError,
    mutate,
  } = Digit.Hooks.ws.useWSApplicationActions(serviceType);
  const mobileView = Digit.Utils.browser.isMobile() ? true : false;

  const { data: reciept_data, isLoading: recieptDataLoading } = Digit.Hooks.useRecieptSearch(
    {
      tenantId: stateCode,
      businessService: serviceType == "WATER" ? "WS.ONE_TIME_FEE" : "SW.ONE_TIME_FEE",
      consumerCodes: applicationDetails?.applicationData?.applicationNo,
    },
    {
      enabled:
        applicationDetails?.applicationData?.applicationNo &&
        applicationDetails?.applicationData?.applicationType?.includes("NEW_") &&
        !applicationDetails?.colletionOfData?.length > 0
          ? true
          : false,
    }
  );
  //for common receipt key.
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
    const ConnectionDetailsfile =
      serviceType === "WATER"
        ? await Digit.PaymentService.generatePdf(tenantId, { WaterConnection: [applicationDetails?.applicationData] }, "ws-consolidatedacknowlegment")
        : await Digit.PaymentService.generatePdf(
            tenantId,
            { SewerageConnections: [applicationDetails?.applicationData] },
            "ws-consolidatedsewerageconnection"
          );
    const file = await Digit.PaymentService.printReciept(tenantId, { fileStoreIds: ConnectionDetailsfile.filestoreIds[0] });
    window.open(file[ConnectionDetailsfile.filestoreIds[0]], "_blank");
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

  const getModifyConnectionButton = () => {
    let pathname = `/digit-ui/employee/ws/modify-application?applicationNumber=${applicationDetails?.applicationData?.applicationNo}&service=${serviceType}&propertyId=${applicationDetails?.propertyDetails?.propertyId}`;

    history.push(`${pathname}`, { data: applicationDetails });
  };

  const getBillAmendmentButton = () => {
    let pathname = `/digit-ui/employee/ws/bill-amendment?connectionNumber=${applicationDetails?.applicationData?.applicationNo}&tenantId=${getTenantId}&service=${serviceType}`;

    if (billData[0]?.status === "INWORKFLOW") {
      setshowActionToast({
        type: "error",
        label: "WORKFLOW_IN_PROGRESS",
      });
      return;
    } else billData?.length > 0;
    history.push(`${pathname}`, { data: applicationDetails });
  };

  const getDisconnectionButton = () => {
    let pathname = `/digit-ui/employee/ws/disconnection-application`;
    if (billData[0]?.status === "ACTIVE" || due === "0") {
      history.push(`${pathname}`);
    } else {
      setshowModal(true);
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

  const showAction = due !== "0" ? actionConfig : actionConfig.filter((item) => item !== "BILL_AMENDMENT_BUTTON");

  async function getRecieptSearch(payments) {
    if (applicationDetails?.colletionOfData?.length > 0) {
      const fileStore = await Digit.PaymentService.printReciept(stateCode, { fileStoreIds: applicationDetails?.colletionOfData?.[0]?.fileStoreId });
      window.open(fileStore[applicationDetails?.colletionOfData?.[0]?.fileStoreId], "_blank");
    } else {
      let response = await Digit.PaymentService.generatePdf(tenantId, { Payments: [{ ...payments }] }, receiptKey);
      const fileStore = await Digit.PaymentService.printReciept(tenantId, { fileStoreIds: response.filestoreIds[0] });
      window.open(fileStore[response?.filestoreIds[0]], "_blank");
    }
  }

  let dowloadOptions = [];

  const appFeeDownloadReceipt = {
    order: 1,
    label: t("DOWNLOAD_RECEIPT_HEADER"),
    onClick: () => getRecieptSearch(reciept_data?.Payments?.[0]),
  };

  const connectionDetailsReceipt = {
    order: 2,
    label: t("WS_CONNECTION_DETAILS_RECEIPT"),
    onClick: () => downloadConnectionDetails(),
  };

  if (reciept_data?.Payments?.length > 0 || applicationDetails?.colletionOfData?.length > 0)
    dowloadOptions = [appFeeDownloadReceipt, connectionDetailsReceipt];
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
          labelComponent={<WSInfoLabel t={t} />}
        />
        {ifUserRoleExists("WS_CEMP") && checkApplicationStatus ? (
          <ActionBar>
            {displayMenu ? <Menu options={showAction} localeKeyPrefix={"WS"} t={t} onSelect={onActionSelect} /> : null}

            <SubmitBar label={t("WF_TAKE_ACTION")} onSubmit={() => setDisplayMenu(!displayMenu)} />
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
                {t("WS_COMMON_TABLE_COL_AMT_DUE_LABEL")}: ₹{due}
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
