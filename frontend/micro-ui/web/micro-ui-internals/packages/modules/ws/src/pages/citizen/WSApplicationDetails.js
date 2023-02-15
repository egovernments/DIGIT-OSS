import {
  Card,
  CardSubHeader,
  Header,
  LinkButton,
  Loader,
  Row,
  StatusTable,
  CardSectionHeader,
  MultiLink,
  CardText,
  CardHeader,
  SubmitBar,
} from "@egovernments/digit-ui-react-components";
import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
//import PropertyDocument from "../../pageComponents/PropertyDocument";
import WSWFApplicationTimeline from "../../pageComponents/WSWFApplicationTimeline";
import WSDocument from "../../pageComponents/WSDocument";
import getPDFData from "../../utils/getWSAcknowledgementData";
import getDisconnectPDFData from "../../utils/getWSDisconnectionApplicationForm"
import { convertEpochToDateDMY, getFiles } from "../../utils";
import { stringReplaceAll, convertEpochToDate } from "../../utils";
import WSInfoLabel from "../../pageComponents/WSInfoLabel";
import { getAddress } from "../../utils";
import _ from "lodash";

const WSApplicationDetails = () => {
  const { t } = useTranslation();
  const menuRef = useRef();
  const user = Digit.UserService.getUser();
  const tenantId = Digit.SessionStorage.get("CITIZEN.COMMON.HOME.CITY")?.code || user?.info?.permanentCity || Digit.ULBService.getCurrentTenantId();
  const stateCode = Digit.ULBService.getStateId();
  const [showOptions, setShowOptions] = useState(false);
  const applicationNobyData = window.location.href.includes("SW_")
    ? window.location.href.substring(window.location.href.indexOf("SW_"))
    : window.location.href.substring(window.location.href.indexOf("WS_"));
  //const { acknowledgementIds } = useParams();

  let filter1 = { tenantId: tenantId, applicationNumber: applicationNobyData };
  const { isLoading, isError, error, data } = Digit.Hooks.ws.useMyApplicationSearch(
    { filters: filter1, BusinessService: applicationNobyData?.includes("SW") ? "SW" : "WS" },
    { filters: filter1, privacy: Digit.Utils.getPrivacyObject() }
  );

  const closeModal = () => {
    setShowOptions(false);
  };
  Digit.Hooks.useClickOutside(menuRef, closeModal, showOptions);

  // const fetchBillParams = { consumerCode: data?.WaterConnection?.[0]?.connectionNo };
  const fetchBillParams = { consumerCode: applicationNobyData?.includes("DC") ? (data?.WaterConnection?.[0]?.connectionNo || data?.SewerageConnections?.[0]?.connectionNo) : (data?.WaterConnection?.[0]?.applicationNo || data?.SewerageConnections?.[0]?.applicationNo) };

  const { data: generatePdfKey } = Digit.Hooks.useCommonMDMS(tenantId, "common-masters", "ReceiptKey", {
    select: (data) =>
      data["common-masters"]?.uiCommonPay?.filter(({ code }) => "WS.ONE_TIME_FEE"?.includes(code))[0]?.receiptKey || "consolidatedreceipt",
  });

  const paymentDetails = Digit.Hooks.useFetchBillsForBuissnessService(
    { businessService: applicationNobyData?.includes("SW") ? (applicationNobyData?.includes("DC") ? "SW" : "SW.ONE_TIME_FEE") : (applicationNobyData?.includes("DC") ? "WS" : "WS.ONE_TIME_FEE"), ...fetchBillParams, tenantId: tenantId },
    {
      enabled: data?.WaterConnection?.[0]?.applicationNo || data?.SewerageConnections?.[0]?.applicationNo ? true : false,
      retry: false,
    }
  );

  const { isLoading: isPTLoading, isError: isPTError, error: PTerror, data: PTData } = Digit.Hooks.pt.usePropertySearch(
    { filters: { propertyIds: data?.WaterConnection?.[0]?.propertyId } },
    { filters: { propertyIds: data?.WaterConnection?.[0]?.propertyId }, privacy: Digit.Utils.getPrivacyObject() }
  );

  const checkifPrivacyenabled = Digit.Hooks.ws.useToCheckPrivacyEnablement({privacy : { uuid:(applicationNobyData?.includes("WS") ? data?.WaterConnection?.[0]?.connectionHolders?.[0]?.uuid : data?.SewerageConnections?.[0]?.connectionHolders?.[0]?.uuid), fieldName: "connectionHoldersMobileNumber", model: "WnSConnectionOwner" }}) || false;

  const isPaid = (data?.WaterConnection?.[0]?.applicationStatus === 'CONNECTION_ACTIVATED' || data?.WaterConnection?.[0]?.applicationStatus === 'PENDING_FOR_CONNECTION_ACTIVATION') || (data?.SewerageConnections?.[0]?.applicationStatus === 'CONNECTION_ACTIVATED' || data?.SewerageConnections?.[0]?.applicationStatus === 'PENDING_FOR_CONNECTION_ACTIVATION') ? true : false;
  if (isLoading) {
    return <Loader />;
  }

  const handleDownloadPdf = async () => {
    const tenantInfo = data?.WaterConnection?.[0]?.tenantId || data?.SewerageConnections?.[0]?.tenantId;
    let res = data?.WaterConnection?.[0] || data?.SewerageConnections?.[0];
    const PDFdata = getPDFData({ ...res }, { ...PTData?.Properties?.[0] }, tenantInfo, t);
    PDFdata.then((ress) => Digit.Utils.pdf.generatev1(ress));
    setShowOptions(false);
  };

  const handleDownloadDisconnectPdf = async () => {
    const tenantInfo = data?.WaterConnection?.[0]?.tenantId || data?.SewerageConnections?.[0]?.tenantId;
    let res = data?.WaterConnection?.[0] || data?.SewerageConnections?.[0];
    const PDFdata = getDisconnectPDFData({ ...res }, { ...PTData?.Properties?.[0] }, tenantInfo, t);
    PDFdata.then((ress) => Digit.Utils.pdf.generatev1(ress));
    setShowOptions(false);
  };

  async function getDisconnectionNoticeSearch() {
    let key = "ws-waterdisconnectionnotice";
    let details = {};
    if ((applicationNobyData?.includes("WS"))) {
    details = { WaterConnection: [ {...data?.WaterConnection?.[0],property:PTData?.Properties?.[0]} ] }
    }
    else {
      key = "ws-seweragedisconnectionnotice";
      details = { SewerageConnection: [{...data?.SewerageConnections?.[0],property:PTData?.Properties?.[0]}] }
    }
    let response = await Digit.WSService.WSDisconnectionNotice(data?.WaterConnection?.[0]?.tenantId || data?.SewerageConnections?.[0]?.tenantId, details, key);
    const fileStore = await Digit.PaymentService.printReciept(data?.WaterConnection?.[0]?.tenantId || data?.SewerageConnections?.[0]?.tenantId, { fileStoreIds: response.filestoreIds[0] });
    window.open(fileStore[response?.filestoreIds[0]], "_blank");
  }


  const printApplicationReceipts = async () => {
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const state = Digit.ULBService.getStateId();

    let key = data?.WaterConnection?.[0] ? "WS.ONE_TIME_FEE" : "SW.ONE_TIME_FEE"
    const payments = await Digit.PaymentService.getReciept(tenantId, key, { consumerCodes: data?.WaterConnection?.[0] ? data?.WaterConnection?.[0]?.applicationNo : data?.SewerageConnections?.[0]?.applicationNo });
    let response = { filestoreIds: [payments.Payments[0]?.fileStoreId] };

    if (!payments.Payments[0]?.fileStoreId) {
      response = await Digit.PaymentService.generatePdf(state, { Payments: payments.Payments }, generatePdfKey);
    }
    const fileStore = await Digit.PaymentService.printReciept(state, { fileStoreIds: response.filestoreIds[0] });
    window.open(fileStore[response.filestoreIds[0]], "_blank");
  };

  // const { WaterConnection: applicationsList } = data || {};
  let downloadOptions = [];

  // downloadOptions.push({
  //   label: t("CS_COMMON_APPLICATION_ACKNOWLEDGEMENT"),
  //   onClick: handleDownloadPdf,
  // })

  const wsEstimateDownloadObject = {
    order: 1,
    label: t("WS_ESTIMATION_NOTICE"),
    onClick: () => data?.WaterConnection?.[0] ? getFiles([data?.WaterConnection?.[0]?.additionalDetails?.estimationFileStoreId], stateCode) : getFiles([data?.SewerageConnections?.[0]?.additionalDetails?.estimationFileStoreId], stateCode),
  };

  const sanctionDownloadObject = {
    order: 2,
    label: t("WS_SANCTION_LETTER"),
    onClick: () => data?.WaterConnection?.[0] ? getFiles([data?.WaterConnection?.[0]?.additionalDetails?.sanctionFileStoreId], stateCode) : getFiles([data?.SewerageConnections?.[0]?.additionalDetails?.sanctionFileStoreId], stateCode),
  };

  const applicationDownloadObject = {
    order: 3,
    label: t("WS_APPLICATION"),
    onClick: handleDownloadPdf,
  };

  const receiptApplicationFeeDownloadObject = {
    order: 4,
    label: t("WS_RECEIPT_APPLICATION_FEE"),
    onClick: printApplicationReceipts,
  };
  
  const disconnectionNoticeNApplicationFormOptions = [
    {
      order: 1,
      label: t("WS_APPLICATION"),
      onClick: handleDownloadDisconnectPdf,
    },
    {
      order: 2,
      label: t("WS_DISCONNECTION_NOTICE_LABEL"),
      onClick: () => getDisconnectionNoticeSearch(),
    }
];
  const isDisconnection = (data?.WaterConnection?.[0].applicationType?.includes("DISCONNECT") || data?.SewerageConnections?.[0].applicationType?.includes("DISCONNECT"));
  const appStatus = data?.WaterConnection?.[0]?.applicationStatus || data?.SewerageConnections?.[0]?.applicationStatus;
  switch (appStatus) {
    case "PENDING_FOR_DOCUMENT_VERIFICATION":
      if(data?.WaterConnection?.[0].applicationType?.includes("DISCONNECT") || data?.SewerageConnections?.[0].applicationType?.includes("DISCONNECT") ){
        downloadOptions = disconnectionNoticeNApplicationFormOptions
      }
      else{
        downloadOptions = downloadOptions.concat(applicationDownloadObject);
      }
      break;
    case "PENDING_FOR_CITIZEN_ACTION":
    case "PENDING_FOR_FIELD_INSPECTION":
      downloadOptions = downloadOptions.concat(applicationDownloadObject);
      // dowloadOptions = [applicationDownloadObject];
      break;
    case "PENDING_APPROVAL_FOR_CONNECTION":
    case "PENDING_FOR_PAYMENT":
      downloadOptions = downloadOptions.concat(applicationDownloadObject, wsEstimateDownloadObject);
      break;
    case "PENDING_FOR_CONNECTION_ACTIVATION":
    case "CONNECTION_ACTIVATED":
      downloadOptions = downloadOptions.concat(
        sanctionDownloadObject,
        wsEstimateDownloadObject,
        applicationDownloadObject,
        receiptApplicationFeeDownloadObject
      );
      break;
    case "REJECTED":
      downloadOptions = downloadOptions.concat(applicationDownloadObject);
      break;
    case "PENDING_FOR_DISCONNECTION_EXECUTION":
    case "DISCONNECTION_EXECUTED":
    case "PENDING_FOR_PAYMENT":
      if(data?.WaterConnection?.[0].applicationType?.includes("DISCONNECT") || data?.SewerageConnections?.[0].applicationType?.includes("DISCONNECT") ){
        downloadOptions = disconnectionNoticeNApplicationFormOptions
      }
      else{
        downloadOptions = downloadOptions.concat(applicationDownloadObject);
      }
      break;
    default:
      downloadOptions = downloadOptions.concat(applicationDownloadObject);
      break;
  }

  downloadOptions.sort(function (a, b) {
    return a.order - b.order;
  });
let serviceType = data && data?.WaterConnection?.[0] ? "WATER" : "SEWERAGE";
  //const application = data?.Properties[0];
  sessionStorage.setItem("ApplicationNoState", applicationNobyData);
  return (
    <React.Fragment>
      {downloadOptions && downloadOptions.length > 0 && (
        <div ref={menuRef}>
        <MultiLink
        className="multilinkWrapper"
        onHeadClick={() => setShowOptions(!showOptions)}
        displayOptions={showOptions}
        options={downloadOptions}
        // optionsStyle={{margin: '0px'}}
        />
        </div>        
        )}
      <div className="cardHeaderWithOptions" style={{ marginRight: "auto", maxWidth: "960px" }}>
        <Header>{t("WS_APPLICATION_DETAILS_HEADER")}</Header>
      </div>
      {checkifPrivacyenabled && <WSInfoLabel t={t} /> }
      <div className="hide-seperator">
        <Card>
          <StatusTable>
            <Row
              className="border-none"
              label={t("WS_MYCONNECTIONS_APPLICATION_NO")}
              text={data?.WaterConnection?.[0]?.applicationNo || data?.SewerageConnections?.[0]?.applicationNo}
              textStyle={{}}
            />
            {(data?.WaterConnection?.[0].applicationType?.includes("DISCONNECT")  || data?.SewerageConnections?.[0].applicationType?.includes("DISCONNECT")) 
              && (
                <Row
                  className="border-none"
                  label={t("WS_MYCONNECTIONS_CONSUMER_NO")}
                  text={data?.WaterConnection?.[0]?.connectionNo || data?.SewerageConnections?.[0]?.connectionNo}
                  textStyle={{wordBreak:"break-word"}}
            />
              )
            }
            <Row
              className="border-none"
              label={t("WS_SERVICE_NAME_LABEL")}
              text={t(`WS_APPLICATION_TYPE_${data?.WaterConnection?.[0]?.applicationType || data?.SewerageConnections?.[0]?.applicationType}`)}
              textStyle={{wordBreak:"break-word"}}
            />
            <Row
              className="border-none"
              label={t("WS_COMMON_TABLE_COL_AMT_DUE_LABEL")}
              text={paymentDetails?.data?.Bill?.[0]?.billDetails?.[0]?.amount ? "₹ " + Number(paymentDetails?.data?.Bill?.[0]?.billDetails?.[0]?.amount).toFixed(2) : t("₹0")}
              textStyle={{ whiteSpace: "pre" }}
            />
            {(data?.WaterConnection?.[0].applicationType?.includes("DISCONNECT")  || data?.SewerageConnections?.[0].applicationType?.includes("DISCONNECT")) 
              && (
                <Row
                  className="border-none"
                  label={t("WS_DISCONNECTION_PROPOSED_DATE")}
                  text={ applicationNobyData?.includes("WS") 
                          ? convertEpochToDate(data?.WaterConnection?.[0]?.dateEffectiveFrom) 
                          : convertEpochToDate(data?.SewerageConnections?.[0]?.dateEffectiveFrom)}
                  textStyle={{wordBreak:"break-word"}}
                />
              )
            }
            {(data?.WaterConnection?.[0].applicationType?.includes("DISCONNECT")  || data?.SewerageConnections?.[0].applicationType?.includes("DISCONNECT")) 
              && (
                <Row
                  className="border-none"
                  label={t("WS_DISCONNECTION_EXECUTED_DATE")}
                  text={ applicationNobyData?.includes("WS") 
                          ? convertEpochToDate(data?.WaterConnection?.[0]?.disconnectionExecutionDate) 
                          : convertEpochToDate(data?.SewerageConnections?.[0]?.disconnectionExecutionDate)}
                  textStyle={{wordBreak:"break-word"}}
                />
              )
            }
             {(data?.WaterConnection?.[0].applicationType?.includes("DISCONNECT")  || data?.SewerageConnections?.[0].applicationType?.includes("DISCONNECT")) 
              && (
                <Row
                  className="border-none"
                  label={t("WS_DISCONNECTION_REASON")}
                  text={data?.WaterConnection?.[0]?.disconnectionReason != null 
                        ? data?.WaterConnection?.[0]?.disconnectionReason 
                        : data?.SewerageConnections?.[0]?.disconnectionReason != null 
                        ? data?.SewerageConnections?.[0]?.disconnectionReason 
                        : t("NA") }
                  textStyle={{wordBreak:"break-word"}}
            />
              )
            }
          </StatusTable>
        </Card>
        {paymentDetails?.data?.Bill?.[0]?.billDetails?.[0]?.billAccountDetails.length > 0 && (
          <Card>
            <CardHeader styles={{ fontSize: "28px" }}>{t("WS_FEE_DEATAILS_HEADER")}</CardHeader>
            <StatusTable>
              {paymentDetails?.data?.Bill?.[0]?.billDetails?.[0]?.billAccountDetails.map((bill) => (
                <Row className="border-none" label={t(bill?.taxHeadCode)} text={`₹${Number(bill?.amount).toFixed(2)}`} textStyle={{ textAlign: "right" }} />
              ))}
              <Row
                className="border-none"
                label={t("WS_TOTAL_AMOUNT_DUE")}
                text={`₹${Number(isPaid? 0 : paymentDetails?.data?.Bill?.[0]?.billDetails?.[0]?.amount).toFixed(2)}`}
                textStyle={{ textAlign: "right", fontSize:"18px", fontWeight: "700" }}
              />
              <Row
                className="border-none"
                label={t("WS_COMMON_TABLE_COL_APPLICATION_STATUS")}
                text={isPaid || Number(paymentDetails?.data?.Bill?.[0]?.billDetails?.[0]?.amount).toFixed(2) == 0 ? t("WS_COMMON_PAID_LABEL") : t("WS_COMMON_NOT_PAID")}
                textStyle={
                  isPaid || (Number(paymentDetails?.data?.Bill?.[0]?.billDetails?.[0]?.amount).toFixed(2) == 0 )
                    ? { textAlign: "right", color: "darkgreen" }
                    : { textAlign: "right", color: "red" }
                }
              />
              {/* <Row label={t("One time Fee")} text={"₹ 16500.00"} textStyle={{textAlign: "right" }} />
            <Row label={t("Security Charge")} text={"₹ 500.00"} textStyle={{textAlign: "right" }} />
            <Row label={t("Meter Charge")} text={"₹ 2000.00"} textStyle={{textAlign: "right" }} />
            <Row label={t("Tax")} text={" ₹ 200.00"} textStyle={{textAlign: "right" }} />
            <Row label={t("WS_COMMON_TOTAL_AMT")} text={"₹ 15000.00"} textStyle={{textAlign: "right" }} />
            <Row label={t("Status")} text={"Unpaid"} textStyle={{textAlign: "right" }} /> */}
            </StatusTable>
          </Card>
        )}
        <Card>
          <CardHeader styles={{ fontSize: "28px" }}>{t("WS_COMMON_PROPERTY_DETAILS")}</CardHeader>
          <StatusTable>
            <Row
              className="border-none"
              label={t("WS_PROPERTY_ID_LABEL")}
              text={data?.WaterConnection?.[0]?.propertyId || data?.SewerageConnections?.[0]?.propertyId}
              textStyle={{wordBreak:"break-word"}}
            />
            <Row
              className="border-none"
              label={t("WS_OWN_DETAIL_OWN_NAME_LABEL")}
              text={PTData?.Properties?.[0]?.owners?.[0]?.name}
              textStyle={{ whiteSpace: "pre" }}
            />
            <Row
              className="border-none"
              label={t("WS_PROPERTY_ADDRESS")}
              text={ getAddress(PTData?.Properties?.[0]?.address, t) || t("CS_NA") }
              textStyle={{wordBreak:"break-word"}}
              privacy={ {
                uuid: PTData?.Properties?.[0]?.owners?.[0]?.uuid,
                fieldName: ["doorNo", "street", "landmark"],
                model: "Property",
                hide: !(PTData?.Properties?.[0]?.address),
                showValue: true,
                loadData: {
                  serviceName: "/property-services/property/_search",
                  requestBody: {},
                  requestParam: { tenantId : tenantId, propertyIds : data?.WaterConnection?.[0]?.propertyId || data?.SewerageConnections?.[0]?.propertyId },
                  jsonPath: "Properties[0].address.street",
                  isArray: false,
                  d: (res) => {
                    let resultString = (_.get(res,"Properties[0].address.doorNo") ?  `${_.get(res,"Properties[0].address.doorNo")}, ` : "") + (_.get(res,"Properties[0].address.street")? `${_.get(res,"Properties[0].address.street")}, ` : "") + (_.get(res,"Properties[0].address.landmark") ? `${_.get(res,"Properties[0].address.landmark")}`:"")
                    return resultString;
                  }
                },
              }}
            />
            <Link
              to={`/digit-ui/citizen/commonpt/view-property?propertyId=${
                data?.WaterConnection?.[0]?.propertyId || data?.SewerageConnections?.[0]?.propertyId
              }&tenantId=${data?.WaterConnection?.[0]?.tenantId || data?.SewerageConnections?.[0]?.tenantId}`}
            >
              <LinkButton style={{ textAlign: "left" }} label={t("WS_VIEW_PROPERTY")} />
            </Link>
          </StatusTable>
        </Card>
        {data?.WaterConnection?.[0]?.connectionHolders?.length > 0 || data?.SewerageConnections?.[0]?.connectionHolders?.length > 0 ? (
          <Card>
            <CardHeader styles={{ fontSize: "28px" }}>{t("WS_COMMON_CONNECTION_HOLDER_DETAILS_HEADER")}</CardHeader>
            <StatusTable>
              <Row
                className="border-none"
                label={t("WS_OWN_DETAIL_MOBILE_NO_LABEL")}
                text={data?.WaterConnection?.[0]?.connectionHolders?.[0]?.mobileNumber || data?.SewerageConnections?.[0]?.connectionHolders?.[0]?.mobileNumber}
                textStyle={{ whiteSpace: "pre" }}
                privacy={ {
                  uuid: applicationNobyData?.includes("WS") ? data?.WaterConnection?.[0]?.connectionHolders?.[0]?.uuid : data?.SewerageConnections?.[0]?.connectionHolders?.[0]?.uuid,
                  fieldName: "connectionHoldersMobileNumber",
                  model: "WnSConnectionOwner",
                  showValue: false,
                  loadData: {
                    serviceName: serviceType === "WATER" ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
                    requestBody: {},
                    requestParam: { tenantId, applicationNumber:applicationNobyData },
                    jsonPath: serviceType === "WATER" ? "WaterConnection[0].connectionHolders[0].mobileNumber" : "SewerageConnections[0].connectionHolders[0].mobileNumber",
                    isArray: false,
                  }, }
                }
              />
              <Row
                className="border-none"
                label={t("WS_OWN_DETAIL_OWN_NAME_LABEL")}
                text={data?.WaterConnection?.[0]?.connectionHolders?.[0]?.name || data?.SewerageConnections?.[0]?.connectionHolders?.[0]?.name}
                textStyle={{ whiteSpace: "pre" }}
              />
              <Row
                className="border-none"
                label={t("WS_OWN_DETAIL_GENDER_LABEL")}
                text={t(data?.WaterConnection?.[0]?.connectionHolders?.[0]?.gender || data?.SewerageConnections?.[0]?.connectionHolders?.[0]?.gender)}
                textStyle={{ whiteSpace: "pre" }}
                privacy={ {
                  uuid: applicationNobyData?.includes("WS") ? data?.WaterConnection?.[0]?.connectionHolders?.[0]?.uuid : data?.SewerageConnections?.[0]?.connectionHolders?.[0]?.uuid,
                  fieldName: "gender",
                  model: "WnSConnectionOwner",
                  showValue: false,
                  loadData: {
                    serviceName: serviceType === "WATER" ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
                    requestBody: {},
                    requestParam: { tenantId, applicationNumber:applicationNobyData },
                    jsonPath: serviceType === "WATER" ? "WaterConnection[0].connectionHolders[0].gender" : "SewerageConnections[0].connectionHolders[0].gender",
                    isArray: false,
                  },
                }}
              />
              <Row
                className="border-none"
                label={t("WS_OWN_DETAIL_FATHER_OR_HUSBAND_NAME")}
                text={data?.WaterConnection?.[0]?.connectionHolders?.[0]?.fatherOrHusbandName || data?.SewerageConnections?.[0]?.connectionHolders?.[0]?.fatherOrHusbandName || t("CS_NA")}
                textStyle={{ whiteSpace: "pre" }}
                privacy={ {
                  uuid: applicationNobyData?.includes("WS") ? data?.WaterConnection?.[0]?.connectionHolders?.[0]?.uuid : data?.SewerageConnections?.[0]?.connectionHolders?.[0]?.uuid,
                  fieldName: "fatherOrHusbandName",
                  model: "WnSConnectionOwner", //applicationNobyData?.includes("WS") ? "WaterConnectionOwner" : "User"
                  showValue: false,
                  loadData: {
                    serviceName: serviceType === "WATER" ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
                    requestBody: {},
                    requestParam: { tenantId, applicationNumber:applicationNobyData },
                    jsonPath: serviceType === "WATER" ? "WaterConnection[0].connectionHolders[0].fatherOrHusbandName" : "SewerageConnections[0].connectionHolders[0].fatherOrHusbandName",
                    isArray: false,
                  },
                }}
              />
              <Row
                className="border-none"
                label={t("WS_OWN_DETAIL_RELATION_LABEL")}
                text={data?.WaterConnection?.[0]?.connectionHolders?.[0]?.relationship || data?.SewerageConnections?.[0]?.connectionHolders?.[0]?.relationship || t("CS_NA")}
                textStyle={{ whiteSpace: "pre" }}
                privacy={ {
                  uuid: applicationNobyData?.includes("WS") ? data?.WaterConnection?.[0]?.connectionHolders?.[0]?.uuid : data?.SewerageConnections?.[0]?.connectionHolders?.[0]?.uuid,
                  fieldName: "relationship",
                  model: "WnSConnection",
                  showValue: false,
                  loadData: {
                    serviceName: serviceType === "WATER" ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
                    requestBody: {},
                    requestParam: { tenantId, applicationNumber:applicationNobyData },
                    jsonPath: serviceType === "WATER" ? "WaterConnection[0].connectionHolders[0].relationship" : "SewerageConnections[0].connectionHolders[0].relationship",
                    isArray: false,
                  },
                }}
              />
              <Row
                className="border-none"
                label={t("WS_OWN_DETAIL_CROSADD")}
                text={data?.WaterConnection?.[0]?.connectionHolders?.[0]?.correspondenceAddress || data?.SewerageConnections?.[0]?.connectionHolders?.[0]?.correspondenceAddress || t("CS_NA")}
                //textStyle={{ whiteSpace: "pre" }}
                privacy={ {
                  uuid: applicationNobyData?.includes("WS") ? data?.WaterConnection?.[0]?.connectionHolders?.[0]?.uuid : data?.SewerageConnections?.[0]?.connectionHolders?.[0]?.uuid,
                  fieldName: "correspondenceAddress",
                  model: "WnSConnectionOwner",
                  showValue: false,
                  loadData: {
                    serviceName: serviceType === "WATER" ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
                    requestBody: {},
                    requestParam: { tenantId, applicationNumber:applicationNobyData },
                    jsonPath: serviceType === "WATER" ? "WaterConnection[0].connectionHolders[0].correspondenceAddress" : "SewerageConnections[0].connectionHolders[0].correspondenceAddress",
                    isArray: false,
                  },
                }}
              />
              <Row 
                className="border-none" 
                label={t("WS_OWN_DETAIL_SPECIAL_APPLICANT_LABEL")} 
                text={ (applicationNobyData?.includes("WS") ? !(data?.WaterConnection?.[0]?.connectionHolders?.[0]?.ownerType?.includes("*")) : !(data?.SewerageConnections?.[0]?.connectionHolders?.[0]?.ownerType?.includes("*"))) ? t(`COMMON_MASTERS_OWNERTYPE_${applicationNobyData?.includes("WS") ? data?.WaterConnection?.[0]?.connectionHolders?.[0]?.ownerType : data?.SewerageConnections?.[0]?.connectionHolders?.[0]?.ownerType}`) : applicationNobyData?.includes("WS") ? data?.WaterConnection?.[0]?.connectionHolders?.[0]?.ownerType : data?.SewerageConnections?.[0]?.connectionHolders?.[0]?.ownerType} textStyle={{ whiteSpace: "pre" }} 
                privacy={ {
                  uuid: applicationNobyData?.includes("WS") ? data?.WaterConnection?.[0]?.connectionHolders?.[0]?.uuid : data?.SewerageConnections?.[0]?.connectionHolders?.[0]?.uuid,
                  fieldName: "ownerType",
                  model: "WnSConnection",
                  showValue: false,
                  loadData: {
                    serviceName: serviceType === "WATER" ? "/ws-services/wc/_search" : "/sw-services/swc/_search",
                    requestBody: {},
                    requestParam: { tenantId, applicationNumber:applicationNobyData },
                    jsonPath: serviceType === "WATER" ? "WaterConnection[0].connectionHolders[0].ownerType" : "SewerageConnections[0].connectionHolders[0].ownerType",
                    isArray: false,
                    d: (res) => {
                      let resultString = (res?.WaterConnection?.[0] ? t(`PROPERTYTAX_OWNERTYPE_${res?.WaterConnection?.[0]?.connectionHolders?.[0]?.ownerType?.toUpperCase()}`) : t(`PROPERTYTAX_OWNERTYPE_${res?.SewerageConnections?.[0]?.connectionHolders?.[0]?.ownerType?.toUpperCase()}`));
                      return resultString;
                    }
                },
                }}
                />
            </StatusTable>
          </Card>
        ) : (
          <div>
            <Card>
              <CardSubHeader>{t("WS_COMMON_CONNECTION_HOLDER_DETAILS_HEADER")}</CardSubHeader>
              <CardText>{t("WS_SAME_AS_PROPERTY_OWNERS")}</CardText>
            </Card>
          </div>
        )}
        { isDisconnection 
        ? null  
        : (<Card>
          <CardHeader styles={{ fontSize: "28px" }}>{t("WS_COMMON_CONNECTION_DETAIL")}</CardHeader>
          {data?.WaterConnection && data?.WaterConnection?.length > 0 && (
            <StatusTable>
              <Row
                className="border-none"
                label={t("WS_TASK_DETAILS_CONN_DETAIL_NO_OF_TAPS_PROPOSED")}
                text={data?.WaterConnection?.[0]?.proposedTaps || t("CS_NA")}
                textStyle={{ whiteSpace: "pre" }}
              />
              <Row
                className="border-none"
                label={t("WS_SERV_DETAIL_PIPE_SIZE")}
                text={`${data?.WaterConnection?.[0]?.proposedPipeSize} ${t("WS_INCHES_LABEL")}` || t("CS_NA")}
                textStyle={{ whiteSpace: "pre" }}
              />

              <Link to={`/digit-ui/citizen/ws/connection/additional/${data?.WaterConnection?.[0]?.applicationNo}`}>
                <LinkButton style={{ textAlign: "left" }} label={t("WS_ADDITIONAL_DETAILS")} />
              </Link>
            </StatusTable>
          )}
          {data?.SewerageConnections && data?.SewerageConnections?.length > 0 && (
            <StatusTable>
              <Row
                className="border-none"
                label={t("WS_NO_OF_WATER_CLOSETS_LABEL")}
                text={data?.SewerageConnections?.[0]?.proposedWaterClosets}
                textStyle={{ whiteSpace: "pre" }}
              />
              <Row
                className="border-none"
                label={t("WS_SERV_DETAIL_NO_OF_TOILETS")}
                text={data?.SewerageConnections?.[0]?.proposedToilets || t("CS_NA")}
                textStyle={{ whiteSpace: "pre" }}
              />
              <Link to={`/digit-ui/citizen/ws/connection/additional/${data?.SewerageConnections?.[0]?.applicationNo}`}>
                <LinkButton style={{ textAlign: "left" }} label={t("WS_ADDITIONAL_DETAILS")} />
              </Link>
            </StatusTable>
          )}
        </Card>)
        }
        {/* <Card>
        <PropertyDocument property={application}></PropertyDocument>
        </Card> */}
        <Card>
          <CardHeader styles={{ fontSize: "28px" }}>{t("WS_COMMON_DOCUMENT_DETAILS")}</CardHeader>
          {data?.WaterConnection?.[0]?.documents &&
            data?.WaterConnection?.[0]?.documents.map((doc, index) => (
              <div key={`doc-${index}`}>
                {
                  <div>
                    <CardSectionHeader>{t(doc?.documentType?.split(".").slice(0, 2).join("_"))}</CardSectionHeader>
                    <StatusTable>
                      {<WSDocument value={data?.WaterConnection?.[0]?.documents} Code={doc?.documentType} index={index} />}
                      {data?.WaterConnection?.[0]?.documents.length != index + 1 ? (
                        <hr style={{ color: "#cccccc", backgroundColor: "#cccccc", height: "2px", marginTop: "20px", marginBottom: "20px" }} />
                      ) : null}
                    </StatusTable>
                  </div>
                }
              </div>
            ))}
          {data?.SewerageConnections?.[0]?.documents &&
            data?.SewerageConnections?.[0]?.documents.map((doc, index) => (
              <div key={`doc-${index}`}>
                {
                  <div>
                    <CardSectionHeader>{t(doc?.documentType?.split(".").slice(0, 2).join("_"))}</CardSectionHeader>
                    <StatusTable>
                      {<WSDocument value={data?.SewerageConnections?.[0]?.documents} Code={doc?.documentType} index={index} />}
                      {data?.SewerageConnections?.[0]?.documents.length != index + 1 ? (
                        <hr style={{ color: "white", backgroundColor: "white", height: "2px", marginTop: "20px", marginBottom: "20px" }} />
                      ) : null}
                    </StatusTable>
                  </div>
                }
              </div>
            ))}
        </Card>
        <Card>
          {/* <PTWFApplicationTimeline application={application} id={acknowledgementIds} /> */}
          <WSWFApplicationTimeline
            application={data?.WaterConnection?.[0] || data?.SewerageConnections?.[0]}
            id={data?.WaterConnection?.[0]?.applicationNo || data?.SewerageConnections?.[0]?.applicationNo}
            paymentbuttonenabled={false}
          />
          {data?.WaterConnection?.[0]?.applicationStatus === "PENDING_FOR_PAYMENT" ||
          data?.SewerageConnections?.[0]?.applicationStatus === "PENDING_FOR_PAYMENT" ? (
            <Link
              to={{
                pathname: `/digit-ui/citizen/payment/my-bills/${
                  paymentDetails?.data?.Bill?.[0]?.businessService
                }/${applicationNobyData?.includes("DC") ? (stringReplaceAll(data?.WaterConnection?.[0]?.connectionNo, "/", "+") || stringReplaceAll(data?.SewerageConnections?.[0]?.connectionNo, "/", "+")) :
                  (stringReplaceAll(data?.WaterConnection?.[0]?.applicationNo, "/", "+") ||
                  stringReplaceAll(data?.SewerageConnections?.[0]?.applicationNo, "/", "+"))
                }?workflow=WNS&tenantId=${data?.WaterConnection?.[0]?.tenantId || data?.SewerageConnections?.[0]?.tenantId}&ConsumerName=${data?.WaterConnection?.[0]?.connectionHolders?.map((owner) => owner.name).join(",") || data?.SewerageConnections?.[0]?.connectionHolders?.map((owner) => owner.name).join(",") || PTData?.Properties?.[0]?.owners?.map((owner) => owner.name).join(",")}&isDisoconnectFlow=${applicationNobyData?.includes("DC")?true : false}`,
                state: {},
              }}
            >
              <SubmitBar label={t("MAKE_PAYMENT")} />
            </Link>
          ) : null}
          { (!data?.WaterConnection?.[0]?.applicationType.includes("DISCONNECT") && data?.WaterConnection?.[0]?.applicationStatus.includes("PENDING_FOR_CITIZEN_ACTION")) ||
          (!data?.SewerageConnections?.[0]?.applicationType.includes("DISCONNECT") && data?.SewerageConnections?.[0]?.applicationStatus.includes("PENDING_FOR_CITIZEN_ACTION")) ? (
            <Link
              to={{
                pathname: `/digit-ui/citizen/ws/edit-application/${data?.WaterConnection?.[0]?.tenantId || data?.SewerageConnections?.[0]?.tenantId}`,
                state: { id: `${data?.WaterConnection?.[0]?.applicationNo || data?.SewerageConnections?.[0]?.applicationNo}` },
              }}
            >
              <SubmitBar label={t("COMMON_EDIT")} />
            </Link>
          ) : null}
          {( data?.WaterConnection?.[0]?.applicationType.includes("DISCONNECT") && data?.WaterConnection?.[0]?.applicationStatus.includes("PENDING_FOR_CITIZEN_ACTION")) ||
          ( data?.SewerageConnections?.[0]?.applicationType.includes("DISCONNECT") && data?.SewerageConnections?.[0]?.applicationStatus.includes("PENDING_FOR_CITIZEN_ACTION")) ? (
            <Link
              to={{
                pathname: `/digit-ui/citizen/ws/resubmit-disconnect-application`,
                state: { id: `${data?.WaterConnection?.[0]?.applicationNo || data?.SewerageConnections?.[0]?.applicationNo}` },
              }}
            >
              <SubmitBar label={t("RESUBMIT_APPLICATION")} onSubmit={
                Digit.SessionStorage.set("WS_DISCONNECTION", applicationNobyData?.includes("SW") ? {
                  applicationData: data?.SewerageConnections?.[0],
                  serviceType: "SEWERAGE",
                  WSDisconnectionForm : {
                    type:  data?.SewerageConnections?.[0]?.isDisconnectionTemporary ? 
                    {
                      code: "type",
                      value: {
                        name: "Temporary",
                        i18nKey: "WS_DISCONNECTIONTYPE_TEMPORARY",
                        active: true,
                        code: "Temporary"
                      }
                    } : 
                    {
                      code: "type",
                      value: {
                      name: "Permanent",
                      i18nKey: "WS_DISCONNECTIONTYPE_PERMANENT",
                      active: true,
                      code: "Permanent"
                      }
                    },
                    date:  convertEpochToDateDMY(data?.SewerageConnections?.[0]?.dateEffectiveFrom, true),
                    reason: {
                      code: "reason",
                      value: data?.SewerageConnections?.[0]?.disconnectionReason
                    },
                    documents: data?.SewerageConnections?.[0]?.documents
                  } 
                }: 
                {
                  applicationData: data?.WaterConnection?.[0],
                  serviceType: "WATER",
                  WSDisconnectionForm :{
                    type: data?.WaterConnection?.[0]?.isDisconnectionTemporary ? 
                    {
                      code: "type",
                      value: {
                        name: "Temporary",
                        i18nKey: "WS_DISCONNECTIONTYPE_TEMPORARY",
                        active: true,
                        code: "Temporary"
                      }
                    } : 
                    {
                      code: "type",
                      value: {
                      name: "Permanent",
                      i18nKey: "WS_DISCONNECTIONTYPE_PERMANENT",
                      active: true,
                      code: "Permanent"
                      }
                    },
                    date: convertEpochToDateDMY(data?.WaterConnection?.[0]?.dateEffectiveFrom, true),
                    reason: {
                      code: "reason",
                      value: data?.WaterConnection?.[0]?.disconnectionReason
                    },
                    documents: data?.WaterConnection?.[0]?.documents
                }
                })
              }/>
            </Link>
          ) : null}
        </Card>
      </div>
    </React.Fragment>
  );
};

export default WSApplicationDetails;
