import React, { useEffect, useState, Fragment } from "react";
import { useTranslation } from "react-i18next";
import ApplicationDetailsTemplate from "../../../../../templates/ApplicationDetails";
import { useHistory } from "react-router-dom";
import { Header, ActionBar, MultiLink } from "@egovernments/digit-ui-react-components";
import * as func from "../../../utils"
import { ifUserRoleExists } from "../../../utils";

const GetConnectionDetails = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const history = useHistory();

  const [showToast, setShowToast] = useState(null);
  let filters = func.getQueryStringParams(location.search);
  const applicationNumber = filters?.applicationNumber;
  const serviceType = filters?.service;
  const [showOptions, setShowOptions] = useState(false);
  const stateCode = Digit.ULBService.getStateId();

  const { isLoading, isError, data: applicationDetails, error } = Digit.Hooks.ws.useConnectionDetail(t, tenantId, applicationNumber, serviceType);

  const {
    isLoading: updatingApplication,
    isError: updateApplicationError,
    data: updateResponse,
    error: updateError,
    mutate,
  } = Digit.Hooks.ws.useWSApplicationActions(serviceType);


  const { data: reciept_data, isLoading: recieptDataLoading } = Digit.Hooks.useRecieptSearch(
    {
      tenantId: stateCode,
      businessService:  serviceType == "WATER" ? "WS.ONE_TIME_FEE" : "SW.ONE_TIME_FEE",
      consumerCodes: applicationDetails?.applicationData?.applicationNo
    },
    {
      enabled: (applicationDetails?.applicationData?.applicationNo && applicationDetails?.applicationData?.applicationType?.includes("NEW_") && !applicationDetails?.colletionOfData?.length > 0) ? true : false
    }
  );

  //for common receipt key.
  const { isCommonmastersLoading, data: mdmsCommonmastersData } = Digit.Hooks.obps.useMDMS(stateCode, "common-masters", ["uiCommonPay"]);
  const commonPayDetails = mdmsCommonmastersData?.["common-masters"]?.uiCommonPay || [];
  const index = commonPayDetails && commonPayDetails.findIndex((item) => { return item.code == "WS.ONE_TIME_FEE"; });
  let commonPayInfo = "";
  if (index > -1) commonPayInfo = commonPayDetails[index];
  else commonPayInfo = commonPayDetails && commonPayDetails.filter(item => item.code === "DEFAULT");
  const receiptKey = commonPayInfo?.receiptKey || "consolidatedreceipt";


  const downloadConnectionDetails = async () => {
    const ConnectionDetailsfile = serviceType === "WATER" ? await Digit.PaymentService.generatePdf(tenantId, { WaterConnection: [applicationDetails?.applicationData] } ,"ws-consolidatedacknowlegment")
      : await Digit.PaymentService.generatePdf(tenantId, { SewerageConnections: [applicationDetails?.applicationData] } ,"ws-consolidatedsewerageconnection");
    const file = await Digit.PaymentService.printReciept(tenantId, { fileStoreIds: ConnectionDetailsfile.filestoreIds[0] });
    window.open(file[ConnectionDetailsfile.filestoreIds[0]], "_blank");
  };

  const downloadApplicationDetails = async () => {
    const res = { ...applicationDetails }
    const tenantInfo = res?.tenantId;
    const PDFdata = getPDFData({ ...res }, { ...res?.property }, tenantInfo, t);
    PDFdata.then((ress) => Digit.Utils.pdf.generate(ress));  
  }

  const closeToast = () => {
    setShowToast(null);
  };
  
  function onActionSelect(action) {
    let pathname = `/digit-ui/employee/ws/modify-application?applicationNumber=${applicationDetails?.applicationData?.applicationNo}&service=${serviceType}&propertyId=${applicationDetails?.propertyDetails?.propertyId}`;
    history.push(`${pathname}`, { data: applicationDetails });
  }

  async function getRecieptSearch(payments) {

    if (applicationDetails?.colletionOfData?.length > 0) {
      const fileStore = await Digit.PaymentService.printReciept(stateCode, { fileStoreIds: applicationDetails?.colletionOfData?.[0]?.fileStoreId });
      window.open(fileStore[applicationDetails?.colletionOfData?.[0]?.fileStoreId], "_blank");
    } else {
      let response = await Digit.PaymentService.generatePdf(tenantId, { Payments: [{...payments}] }, receiptKey);
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

  if (reciept_data?.Payments?.length > 0 || applicationDetails?.colletionOfData?.length > 0) dowloadOptions = [appFeeDownloadReceipt, connectionDetailsReceipt];
  else dowloadOptions = [connectionDetailsReceipt];

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
      />
        {ifUserRoleExists('WS_CEMP') ?
          <ActionBar>
            <button
              style={{ color: "#FFFFFF", fontSize: "19px" }}
              className={"submit-bar"}
              name={"WS_MODIFY_CONNECTION_BUTTON"}
              value={"WS_MODIFY_CONNECTION_BUTTON"}
              onClick={(e) => { onActionSelect("WS_MODIFY_CONNECTION_BUTTON" || {}) }}
            >
              {t(`WS_MODIFY_CONNECTION_BUTTON`)}
            </button>
          </ActionBar> : null
        }
    </div>
    </Fragment>
  );
};

export default GetConnectionDetails;
