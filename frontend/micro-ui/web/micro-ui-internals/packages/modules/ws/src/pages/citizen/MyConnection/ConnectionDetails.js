import {
  Card,
  CardSubHeader,
  CardHeader,
  Header,
  LinkButton,
  Loader,
  Row,
  StatusTable,
  CardSectionHeader,
  MultiLink,
  CardText,
  SubmitBar,
  ActionBar,
  Menu,
  Modal,
  Toast,
} from "@egovernments/digit-ui-react-components";
import { useHistory } from "react-router-dom";

import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
//import PropertyDocument from "../../pageComponents/PropertyDocument";
import WSWFApplicationTimeline from "../../../pageComponents/WSWFApplicationTimeline";
import WSDocument from "../../../pageComponents/WSDocument";
import getPDFData from "../../../utils/getWSAcknowledgementData";
import { stringReplaceAll } from "../../../utils";
import getConnectionDetailsPDF from "../../../utils/getConnectionDetails";

const ConnectionDetails = () => {
  const { t } = useTranslation();
  const menuRef = useRef();
  const user = Digit.UserService.getUser();
  const history = useHistory();
  const tenantId = Digit.SessionStorage.get("CITIZEN.COMMON.HOME.CITY")?.code || user?.info?.permanentCity || Digit.ULBService.getCurrentTenantId();
  const [showOptions, setShowOptions] = useState(false);
  const applicationNobyData = window.location.href.includes("SW_") ? window.location.href.substring(window.location.href.indexOf("SW_")) : window.location.href.substring(window.location.href.indexOf("WS_"));
  // window.location.href.substring(window.location.href.indexOf("WS_"));
  const { state = {} } = useLocation();
  const [showModal, setshowModal] = useState(false);
  const [showActionToast, setshowActionToast] = useState(null);
  const mobileView = Digit.Utils.browser.isMobile();

  let filter1 = { tenantId: tenantId, applicationNumber: applicationNobyData };
  var isSewerageConnections= false;
  var { isLoading, isError, error, data } = Digit.Hooks.ws.useMyApplicationSearch({ filters: filter1, BusinessService: applicationNobyData?.includes("SW") ? "SW" : "WS" }, { filters: filter1, privacy: Digit.Utils.getPrivacyObject()  }, true);

  if(data && data["SewerageConnections"]){
    isSewerageConnections = true;
    var str = JSON.stringify(data);
    str = str.replace(/SewerageConnections/g, 'WaterConnection');    
    data = JSON.parse(str);
  }

  const closeModal = () => {
    setShowOptions(false);
  };
  Digit.Hooks.useClickOutside(menuRef, closeModal, showOptions);

  const { isLoading: isPTLoading, isError: isPTError, error: PTerror, data: PTData } = Digit.Hooks.pt.usePropertySearch(
    { filters: { propertyIds: data?.WaterConnection?.[0]?.propertyId } },
    { filters: { propertyIds: data?.WaterConnection?.[0]?.propertyId } , privacy: Digit.Utils.getPrivacyObject() }
  );

  const closeBillToast = () => {
    setshowActionToast(null);
  };

  const { data: generatePdfKey } = Digit.Hooks.useCommonMDMS(tenantId, "common-masters", "ReceiptKey", {
    select: (data) => data["common-masters"]?.uiCommonPay?.filter(({ code }) => "WS"?.includes(code))[0]?.receiptKey || "consolidatedreceipt",
  });

  async function getConnectionDetail({ tenantId }, order, mode = "download") {
    let requestData = { ...state };
    let response = await Digit.PaymentService.generatePdf(tenantId, { WaterConnection: [requestData] }, "ws-consolidatedacknowlegment");
    const fileStore = await Digit.PaymentService.printReciept(tenantId, { fileStoreIds: response.filestoreIds[0] });
    window.open(fileStore[response?.filestoreIds[0]], "_blank");
  }

  const handleDownloadPdf = async () => {
    const tenantInfo = data?.WaterConnection?.[0]?.tenantId;
    let res = data?.WaterConnection?.[0];
    const PDFdata = getConnectionDetailsPDF({ ...res }, { ...PTData?.Properties?.[0] }, tenantInfo, t);
    PDFdata.then((ress) => Digit.Utils.pdf.generatev1(ress));
    setShowOptions(false);
  };

  const printApplicationReceipts = async () => {
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const state = Digit.ULBService.getStateId();

    const payments = await Digit.PaymentService.getReciept(tenantId, "WS", { consumerCodes: data?.WaterConnection?.[0]?.connectionNo });
    let response = { filestoreIds: [payments.Payments[0]?.fileStoreId] };

    if (!payments.Payments[0]?.fileStoreId) {
      response = await Digit.PaymentService.generatePdf(state, { Payments: payments.Payments }, generatePdfKey);
    }
    const fileStore = await Digit.PaymentService.printReciept(state, { fileStoreIds: response.filestoreIds[0] });
    window.open(fileStore[response.filestoreIds[0]], "_blank");
  };

  let downloadOptions = [];
  downloadOptions.push({
    order: 1,
    label: t("WS_CONNECTION_DETAILS"),
    onClick: () => handleDownloadPdf(),
  });

  const applicationDownloadObject = {
    order: 2,
    label: t("WS_APPLICATION"),
    onClick: () => handleDownloadPdf,
  };

  const receiptApplicationFeeDownloadObject = {
    order: 3,
    label: t("WS_RECEIPT_APPLICATION_FEE"),
    onClick: printApplicationReceipts,
  };

  const appStatus = isSewerageConnections ? data?.WaterConnection?.[0]?.applicationStatus : "";

  // switch (appStatus) {
  //   case "PENDING_FOR_DOCUMENT_VERIFICATION":
  //   case "PENDING_FOR_CITIZEN_ACTION":
  //   case "PENDING_FOR_FIELD_INSPECTION":
  //     downloadOptions = downloadOptions.concat(applicationDownloadObject);
  //     // downloadOptions = [applicationDownloadObject];
  //     break;
  //   case "PENDING_APPROVAL_FOR_CONNECTION":
  //   case "PENDING_FOR_PAYMENT":
  //     downloadOptions = downloadOptions.concat(applicationDownloadObject);
  //     break;
  //   case "PENDING_FOR_CONNECTION_ACTIVATION":
  //   case "CONNECTION_ACTIVATED":
  //     downloadOptions = downloadOptions.concat(applicationDownloadObject, receiptApplicationFeeDownloadObject);
  //     break;
  //   case "REJECTED":
  //     downloadOptions = downloadOptions.concat(applicationDownloadObject);
  //     break;
  //   default:
  //     isSewerageConnections ? downloadOptions = downloadOptions.concat(applicationDownloadObject) : null;
  //     break;
  // }

  downloadOptions.sort(function (a, b) {
    return a.order - b.order;
  });

  const isSW = state?.applicationNo?.includes("SW");
  const fetchBillParams = { consumerCode: state?.connectionNo };
  const paymentDetails = Digit.Hooks.useFetchBillsForBuissnessService(
    { businessService: isSW ? "SW" : "WS", ...fetchBillParams, tenantId: tenantId },
    {
      retry: false,
    }
  );

  const getDisconnectionButton = () => {
    if (!data?.checkWorkFlow){
      setshowActionToast({
        key: "error",
        label: "CONNECTION_INPROGRESS_LABEL",
      });
      setTimeout(() => {
        closeBillToast();
      }, 5000);
    }
    else {
        if (paymentDetails?.data?.Bill?.length === 0 ) {
          let pathname = `/digit-ui/citizen/ws/disconnect-application`;
          Digit.SessionStorage.set("WS_DISCONNECTION", {...state, serviceType: isSW ? "SEWERAGE" : "WATER"});
          history.push(`${pathname}`);
        } else if (paymentDetails?.data?.Bill?.[0]?.totalAmount !== 0) {
          setshowModal(true);
        }
      
    }
    
  };

  function onActionSelect() {
    getDisconnectionButton();
  }
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

  if (isLoading || isPTLoading) {
    return <Loader />;
  }
  sessionStorage.setItem("ApplicationNoState", state?.applicationNo);




  return (
    <React.Fragment>
      <div className="cardHeaderWithOptions" style={{ marginRight: "auto", maxWidth: "960px" }}>
        <Header>{t("WS_COMMON_CONNECTION_DETAIL")}</Header>
        {downloadOptions && downloadOptions.length > 0 && (
          <div ref={menuRef}>
          <MultiLink
            className="multilinkWrapper"
            onHeadClick={() => setShowOptions(!showOptions)}
            displayOptions={showOptions}
            options={downloadOptions}
            optionsStyle={{margin: '0px'}}
          />
          </div>
        )}
      </div>
      <div className="hide-seperator">
        <Card>
          <StatusTable>
            <Row className="border-none" label={t("WS_MYCONNECTIONS_CONSUMER_NO")} text={state?.connectionNo} />
            <Row
              className="border-none"
              label={t("WS_SERVICE_NAME_LABEL")}
              text={t(`WS_APPLICATION_TYPE_${state?.applicationType}`)}
              textStyle={{ wordBreak : "break-word" }}
            />
            <Row className="border-none" label={t("WS_STATUS")} text={state?.status || "NA"} textStyle={{ whiteSpace: "pre" }} />
          </StatusTable>
          <CardHeader styles={{ fontSize: "28px" }}>{t("WS_COMMON_CONNECTION_DETAIL")}</CardHeader>
          <StatusTable>
            {state?.applicationType?.includes("WATER") && <div>
            <Row
              className="border-none"
              label={t("WS_COMMON_TABLE_COL_CONNECTIONTYPE_LABEL")}
              text={state?.connectionType || t("NA")}
              textStyle={{ whiteSpace: "pre" }}
            />
            <Row className="border-none" label={t("WS_SERV_DETAIL_NO_OF_TAPS")} text={state?.noOfTaps} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none" label={t("WS_PIPE_SIZE_IN_INCHES_LABEL")} text={state?.pipeSize || "NA"} textStyle={{ whiteSpace: "pre" }} />
            </div>}
            {state?.applicationType?.includes("SEWERAGE") && <div>
            <Row
                className="border-none"
                label={t("WS_CONN_DETAIL_WATER_CLOSETS")}
                text={state?.proposedWaterClosets}
                textStyle={{ whiteSpace: "pre" }}
              />
              <Row
                className="border-none"
                label={t("WS_SERV_DETAIL_NO_OF_TOILETS")}
                text={state?.proposedToilets || t("CS_NA")}
                textStyle={{ whiteSpace: "pre" }}
              />
              <Row className="border-none" label={t("WS_SERV_DETAIL_CONN_EXECUTION_DATE")} text={state?.connectionExecutionDate ? Digit.DateUtils.ConvertEpochToDate(state?.connectionExecutionDate) : t("CS_NA")} textStyle={{ whiteSpace: "pre" }} />
            </div>}
            {state?.applicationType?.includes("WATER") && (
              <div>
                <Row
                  className="border-none"
                  label={t("WS_SERV_DETAIL_WATER_SOURCE")}
                  text={t(`WS_SERVICES_MASTERS_WATERSOURCE_${stringReplaceAll(state?.waterSource?.split(".")?.[0], ".", "_")}`) ||
                  t(`WS_SERVICES_MASTERS_WATERSOURCE_${stringReplaceAll(state?.waterSource, ".", "_")}`) ||
                  t("CS_NA")}
                  textStyle={{ whiteSpace: "pre" }}
                />
                <Row
                  className="border-none"
                  label={t("WS_SERV_DETAIL_WATER_SUB_SOURCE")}
                  text={t(state?.waterSource?.split(".")?.[1]) || t("CS_NA")}
                  textStyle={{ whiteSpace: "pre" }}
                />
                <Row
                  className="border-none"
                  label={t("WS_SERV_DETAIL_CONN_EXECUTION_DATE")}
                  text={Digit.DateUtils.ConvertEpochToDate(state?.connectionExecutionDate) || t("NA")}
                  textStyle={{ whiteSpace: "pre" }}
                />
                <Row className="border-none" label={t("WS_SERV_DETAIL_METER_ID")} text={state?.meterId} textStyle={{ whiteSpace: "pre" }} />
                <Row
                  className="border-none"
                  label={t("WS_ADDN_DETAIL_METER_INSTALL_DATE")}
                  text={Digit.DateUtils.ConvertEpochToDate(state?.meterInstallationDate) || "NA"}
                  textStyle={{ whiteSpace: "pre" }}
                />
                <Row
                  className="border-none"
                  label={t("WS_ADDN_DETAILS_INITIAL_METER_READING")}
                  text={state?.additionalDetails?.initialMeterReading || "NA"}
                  textStyle={{ whiteSpace: "pre" }}
                />
              </div>
            )}
            {state?.connectionType === "Metered" && (
              <Link to={`/digit-ui/citizen/ws/consumption/details?applicationNo=${state?.connectionNo}`}>
                <LinkButton
                  style={{ textAlign: "left", marginBottom: "10px", marginTop: "5px" }}
                  label={t("WS_CONNECTION_DETAILS_VIEW_CONSUMPTION_LABEL")}
                />
              </Link>
            )}
          </StatusTable>
          <CardHeader styles={{ fontSize: "28px" }}>{t("WS_COMMON_PROPERTY_DETAILS")}</CardHeader>
          <StatusTable>
            <Row className="border-none" label={t("WS_PROPERTY_ID_LABEL")} text={state?.propertyId}  />
            <Row
              className="border-none"
              label={t("WS_OWN_DETAIL_OWN_NAME_LABEL")}
              text={state?.property?.owners?.map((owner) => owner.name).join(",")}
              textStyle={{ whiteSpace: "pre" }}
            />
            <Row
              className="border-none"
              label={t("WS_OWN_DETAIL_CROSADD")}
              text={PTData?.Properties?.[0]?.owners?.[0]?.permanentAddress || t("CS_NA")}
              textStyle={{ wordBreak : "break-word" }}
              privacy={ {
                uuid: PTData?.Properties?.[0]?.owners?.[0]?.uuid,
                fieldName: "permanentAddress",
                model: "User",
                hide: !(PTData?.Properties?.[0]?.owners?.[0]?.permanentAddress),
              }}
            />
            <Link to={`/digit-ui/citizen/commonpt/view-property?propertyId=${state?.propertyId}&tenantId=${state?.tenantId}`}>
              <LinkButton style={{ textAlign: "left", marginBottom: "10px", marginTop: "5px" }} label={t("WS_VIEW_PROPERTY")} />
            </Link>
          </StatusTable>
          <CardHeader styles={{ fontSize: "28px" }}>{t("WS_COMMON_CONNECTION_HOLDER_DETAILS_HEADER")}</CardHeader>
          {state?.connectionHolders ? (
            <div>
              <StatusTable>
                <Row
                  className="border-none"
                  label={t("WS_OWN_DETAIL_MOBILE_NO_LABEL")}
                  text={applicationNobyData?.includes("WS") ? data?.WaterConnection?.[0]?.connectionHolders?.[0]?.mobileNumber : data?.SewerageConnections?.[0]?.connectionHolders?.[0]?.mobileNumber}
                  textStyle={{ whiteSpace: "pre" }}
                  privacy={ {
                    uuid: applicationNobyData?.includes("WS") ? data?.WaterConnection?.[0]?.connectionHolders?.[0]?.uuid : data?.SewerageConnections?.[0]?.connectionHolders?.[0]?.uuid,
                    fieldName: "mobileNumber",
                    model: "User",
                  }}
                />
                <Row
                  className="border-none"
                  label={t("WS_OWN_DETAIL_OWN_NAME_LABEL")}
                  text={state?.connectionHolders?.[0]?.name}
                  textStyle={{ whiteSpace: "pre" }}
                />
                <Row
                  className="border-none"
                  label={t("WS_OWN_DETAIL_GENDER_LABEL")}
                  text={applicationNobyData?.includes("WS") ? data?.WaterConnection?.[0]?.connectionHolders?.[0]?.gender : data?.SewerageConnections?.[0]?.connectionHolders?.[0]?.gender}
                  textStyle={{ whiteSpace: "pre" }}
                  privacy={ {
                    uuid: applicationNobyData?.includes("WS") ? data?.WaterConnection?.[0]?.connectionHolders?.[0]?.uuid : data?.SewerageConnections?.[0]?.connectionHolders?.[0]?.uuid,
                    fieldName: "gender",
                    model: "User",
                  }}
                />
                <Row
                  className="border-none"
                  label={t("WS_OWN_DETAIL_FATHER_OR_HUSBAND_NAME")}
                  text={applicationNobyData?.includes("WS") ? data?.WaterConnection?.[0]?.connectionHolders?.[0]?.fatherOrHusbandName : data?.SewerageConnections?.[0]?.connectionHolders?.[0]?.fatherOrHusbandName}
                  textStyle={{ whiteSpace: "pre" }}
                  privacy={ {
                    uuid: applicationNobyData?.includes("WS") ? data?.WaterConnection?.[0]?.connectionHolders?.[0]?.uuid : data?.SewerageConnections?.[0]?.connectionHolders?.[0]?.uuid,
                    fieldName: "fatherOrHusbandName",
                    model: "User", //applicationNobyData?.includes("WS") ? "WaterConnectionOwner" : "User"
                  }}
                />
                <Row
                  className="border-none"
                  label={t("WS_OWN_DETAIL_RELATION_LABEL")}
                  text={applicationNobyData?.includes("WS") ? data?.WaterConnection?.[0]?.connectionHolders?.[0]?.relationship : data?.SewerageConnections?.[0]?.connectionHolders?.[0]?.relationship}
                  textStyle={{ whiteSpace: "pre" }}
                  privacy={ {
                    uuid: applicationNobyData?.includes("WS") ? data?.WaterConnection?.[0]?.connectionHolders?.[0]?.uuid : data?.SewerageConnections?.[0]?.connectionHolders?.[0]?.uuid,
                    fieldName: "relationship",
                    model: "User", //applicationNobyData?.includes("WS") ? "WaterConnectionOwner" : "User"
                  }}
                />
                <Row
                  className="border-none"
                  label={t("WS_OWN_DETAIL_CROSADD")}
                  text={applicationNobyData?.includes("WS") ? data?.WaterConnection?.[0]?.connectionHolders?.[0]?.correspondenceAddress : data?.SewerageConnections?.[0]?.connectionHolders?.[0]?.correspondenceAddress}
                  textStyle={{ whiteSpace: "pre" }}
                  privacy={ {
                    uuid: state?.connectionHolders?.[0]?.uuid,
                    fieldName: "correspondenceAddress",
                    model: "User",
                    hide: !(state?.connectionHolders),
                  }}
                />
                <Row 
                  className="border-none" 
                  label={t("WS_OWN_DETAIL_SPECIAL_APPLICANT_LABEL")} 
                  text={t(`COMMON_MASTERS_OWNERTYPE_${applicationNobyData?.includes("WS") ? data?.WaterConnection?.[0]?.connectionHolders?.[0]?.ownerType : data?.SewerageConnections?.[0]?.connectionHolders?.[0]?.ownerType}`)} 
                  textStyle={{ whiteSpace: "pre" }} 
                  privacy={ {
                    uuid: state?.connectionHolders?.[0]?.uuid,
                    fieldName: "ownerType",
                    model: "User",
                    hide: !(state?.connectionHolders?.[0]?.ownerType),
                  }}
                  />
              </StatusTable>
            </div>
          ) : (
            <CardText>{t("WS_PROPERTY_OWNER_SAME_AS_CONN_HOLDERS")}</CardText>
          )}
          {/* {state?.documents &&
            state?.documents.map((doc, index) => (
              <div key={`doc-${index}`}>
                {
                  <div>
                    <CardSectionHeader>{t(doc?.documentType?.split(".").slice(0, 2).join("_"))}</CardSectionHeader>
                    <StatusTable>
                      {<WSDocument value={state?.documents} Code={doc?.documentType} index={index} />}
                      {state?.documents.length != index + 1 ? (
                        <hr style={{ color: "#cccccc", backgroundColor: "#cccccc", height: "2px", marginTop: "20px", marginBottom: "20px" }} />
                      ) : null}
                    </StatusTable>
                  </div>
                }
              </div>
            ))} */}
          {state?.status !== "inactive" || state?.applicationStatus !== "Inactive" || state?.applicationStatus !== "INACTIVE" ? (
            <ActionBar style={{ position: "relative", boxShadow: "none", minWidth: "240px", maxWidth: "310px", padding: "0px", marginTop: "15px" }}>
              <div style={{ width: "100%" }}>
                <SubmitBar style={{ width: "100%" }} label={t("WS_DISCONNECTION_BUTTON")} onSubmit={onActionSelect} />
              </div>
            </ActionBar>
          ) : null}

          {showModal ? (
            <Modal

              open={showModal}
              headerBarMain={<Heading label={t("WS_PENDING_DUES_LABEL")} />}
              headerBarEnd={<CloseBtn onClick={() => setshowModal(false)} />}
              center
              formId="modal-action"
              actionSingleLabel={t("COMMON_MAKE_PAYMENT")}
              hideSubmit={true}
              actionSingleSubmit={() => {
                history.push(
                  `/digit-ui/citizen/payment/collect/${isSW ? "SW" : "WS"}/${encodeURIComponent(
                    state?.connectionNo
                  )}/${tenantId}?consumerCode=${state?.connectionNo}&&tenantId=${tenantId}&&workflow=WNS`
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
                  {t("WS_COMMON_TABLE_COL_AMT_DUE_LABEL")}: ₹{Number(paymentDetails?.data?.Bill[0]?.totalAmount).toFixed(2)}
                </span>{" "}
              </div>
            </Modal>
          ) : null}
        </Card>
        {showActionToast && 
          <Toast style={{bottom: "150px"}} error={showActionToast.key} label={t(`${showActionToast.label}`)} onClose={closeBillToast} />}
      </div>
    </React.Fragment>
  );
};

export default ConnectionDetails;
