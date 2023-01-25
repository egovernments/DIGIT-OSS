import { Toast } from "@egovernments/digit-ui-react-components";
import React, { useEffect,useState,Fragment } from "react";
import { useTranslation } from "react-i18next";

export const printReciept = async (businessService, consumerCode) => {
  await Digit.Utils.downloadReceipt(consumerCode, businessService, "consolidatedreceipt");
};

export const printBill = async (businessService, consumerCode) => {
  await Digit.Utils.downloadBill(consumerCode, businessService, "consolidatedreceipt");
};

const retrywnsDownloadBill = async (key, tenantId, locality, isConsolidated, bussinessService, setShowToast,t) => {
  const result = await Digit.WSService.wnsGroupBill({ key, tenantId, locality, isConsolidated, bussinessService });
  
  if(result){    
    setShowToast(() => ({ label: `${t("GRP_JOB_INITIATED_STATUS")} ${result?.jobId}` }))
  }
  
  //setTimeout(setShowToast(null), 5000)
};

const cancelwnsDownloadBill = async (jobid, setShowToast,t) => {
  const result = await Digit.WSService.cancelGroupBill({ jobId:jobid });
  if (result) {
    setShowToast(() => ({ label: `${t("GRP_JOB_INITIATED_STATUS")} ${result?.jobId}` }))
  }
  //setTimeout(setShowToast(null),5000)
};
/* method to get date from epoch */
export const convertEpochToDate = (dateEpoch) => {
  // Returning NA in else case because new Date(null) returns Current date from calender
  if (dateEpoch) {
    const dateFromApi = new Date(dateEpoch);
    let month = dateFromApi.getMonth() + 1;
    let day = dateFromApi.getDate();
    let year = dateFromApi.getFullYear();
    month = (month > 9 ? "" : "0") + month;
    day = (day > 9 ? "" : "0") + day;
    return `${day}/${month}/${year}`;
  } else {
    return "NA";
  }
};

export const stringReplaceAll = (str = "", searcher = "", replaceWith = "") => {
  if (searcher == "") return str;
  while (str.includes(searcher)) {
    str = str.replace(searcher, replaceWith);
  }
  return str;
};

/*   method to check not null  if not returns false*/
export const checkForNotNull = (value = "") => {
  return value && value != null && value != undefined && value != "" ? true : false;
};

export const convertDotValues = (value = "") => {
  return (
    (checkForNotNull(value) && ((value.replaceAll && value.replaceAll(".", "_")) || (value.replace && stringReplaceAll(value, ".", "_")))) || "NA"
  );
};

export const convertToLocale = (value = "", key = "") => {
  let convertedValue = convertDotValues(value);
  if (convertedValue == "NA") {
    return "PT_NA";
  }
  return `${key}_${convertedValue}`;
};

const RECEIPTS_DEFAULT_SERVICE = "PT";

export const getDefaultReceiptService = () => {
  return RECEIPTS_DEFAULT_SERVICE;
};

export const getFinancialYears = (from, to) => {
  const fromDate = new Date(from);
  const toDate = new Date(to);
  if (toDate.getYear() - fromDate.getYear() != 0) {
    return `FY${fromDate.getYear() + 1900}-${toDate.getYear() - 100}`;
  }
  return `${fromDate.toLocaleDateString()}-${toDate.toLocaleDateString()}`;
};

export const getActionButton = (businessService, receiptNumber) => {
  const { t } = useTranslation();
  return (
    <a
      style={{
        color: "#FE7A51",
        cursor: "pointer",
      }}
      onClick={() => {
        printReciept(businessService, receiptNumber);
      }}
    >
      {" "}
      {t(`${"ABG_DOWNLOAD_RECEIPT"}`)}{" "}
    </a>
  );
};

export const getBillNumber = (businessService, consumerCode, billNumber) => {
  return (
    <a
      href="javascript:void(0)"
      style={{
        color: "#FE7A51",
        cursor: "pointer",
      }}
      onClick={() => {
        printBill(businessService, consumerCode);
      }}
    >
      {billNumber}
    </a>
  );
};

//ADDED FOR MOBILE TO VIEW IN NEXT TAB
export const printRecieptMobile = async (businessService, receiptNumber) => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const state = Digit.ULBService.getStateId();
  const payments = await Digit.PaymentService.getReciept(tenantId, businessService, { consumerCodes: receiptNumber });
  let response = { filestoreIds: [payments.Payments[0]?.fileStoreId] };

  if (!payments.Payments[0]?.fileStoreId) {
    response = await Digit.PaymentService.generatePdf(state, { Payments: payments.Payments }, "consolidatedreceipt");
  }
  const fileStore = await Digit.PaymentService.printReciept(state, { fileStoreIds: response.filestoreIds[0] });
  window.open(fileStore[response.filestoreIds[0]], "_blank");
};
export const getRetryButton = (key, tenantId, locality, isConsolidated, businessService,setShowToast,t) => {
  return (
    <>
    <div
      style={{
        color: "#FE7A51",
        cursor: "pointer",
      }}
      onClick={() => {
        retrywnsDownloadBill(key, tenantId, locality, isConsolidated, businessService,setShowToast,t);
      }}
    >
      {t(`${"ABG_RETRY"}`)}
    </div>
    </>
  );
};

export const getCancelButton = (jobid,setShowToast,t) => {
  
  return (
    <div
      style={{
        color: "#FE7A51",
        cursor: "pointer",
      }}
      onClick={() => {
        cancelwnsDownloadBill(jobid,setShowToast,t);
      }}
    >
      {t(`${"GRP_BILL_ACT_CANCEL"}`)}
    </div>
  );
};
