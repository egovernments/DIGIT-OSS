import { ActionBar, Card, Header, Loader, Row, StatusTable, SubmitBar } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import ActionModal from "../components/Modal";
import { convertEpochToDate, convertToLocale, getFinancialYears } from "../utils";

const canCancelReceipt=(Receipt={})=>{
  return Receipt?.paymentStatus !== "CANCELLED" && Receipt?.paymentStatus !== "DEPOSITED" && (Receipt?.instrumentStatus == "APPROVED" || Receipt?.instrumentStatus == "REMITTED");
}

const ReceiptDetails = () => {

  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();
  const { id: receiptId, service: businessService } = useParams();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const isupdate = Digit.SessionStorage.get("isupdate")
  const { isLoading, isError, error, data, ...rest } = Digit.Hooks.receipts.useReceiptsSearch({ receiptNumbers: decodeURIComponent(receiptId), businessServices: businessService }, tenantId, {}, isupdate);

  const cancelReceipt = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const submitAction = (data) => { };
  useEffect(() => {
    return () => {
      rest?.revalidate();
    }
  }, [])

  const [mutationHappened, setMutationHappened, clear] = Digit.Hooks.useSessionStorage("EMPLOYEE_RECEIPT_MUTATION_HAPPENED", false);
  const [successData, setsuccessData, clearSuccessData] = Digit.Hooks.useSessionStorage("EMPLOYEE_RECEIPT_MUTATION_SUCCESS_DATA", false);
  const [errorInfo, setErrorInfo, clearError] = Digit.Hooks.useSessionStorage("EMPLOYEE_RECEIPT_ERROR_DATA", false);
  useEffect(() => {
    setMutationHappened(false);
    clearSuccessData();
    clearError();
  }, []);

  if (isLoading) {
    return <Loader />;
  }
  const PaymentReceipt = !isLoading && data?.Payments?.length > 0 ? data.Payments[0] : {};
  const pendingDue= PaymentReceipt?.totalDue - PaymentReceipt?.totalAmountPaid;
  return (
    <React.Fragment>
      <div style={{ width: "30%", fontFamily: "calibri", color: "#FF0000" }}>
        <Header>{t("CR_RECEIPT_SUMMARY")}</Header>
      </div>
      {!isLoading && data?.Payments?.length > 0 ? (
        <div >
          <Card>
            <StatusTable>
              <Row label={t("CR_RECEIPT_NUMBER")} text={PaymentReceipt?.paymentDetails[0]?.receiptNumber || "NA"} textStyle={{ whiteSpace: "pre" }} />
              <Row label={t("CR_RECEIPT_CONSUMER_NUMBER")} text={PaymentReceipt?.paymentDetails[0]?.bill?.consumerCode || "NA"} textStyle={{ whiteSpace: "pre" }} />
              <Row label={t("CR_RECEIPT_PAYMENT_DATE")} text={convertEpochToDate(PaymentReceipt?.paymentDetails[0]?.receiptDate) || "NA"} />
              <Row label={t("CR_RECEIPT_PAYER_NAME")} text={PaymentReceipt?.payerName || "NA"} />
              <Row label={t("CR_RECEIPT_PAYER_NUMBER")} text={PaymentReceipt?.mobileNumber || "NA"} />
              <Row label={t("CR_RECEIPT_SERVICE_TYPE")} text={t(convertToLocale(PaymentReceipt?.paymentDetails[0]?.businessService, 'BILLINGSERVICE_BUSINESSSERVICE')) || "NA"} />
              <Row label={t("CR_RECEIPT_BILL_PERIOD")} text={getFinancialYears(PaymentReceipt?.paymentDetails[0]?.bill?.billDetails[0]?.fromPeriod,PaymentReceipt?.paymentDetails[0]?.bill?.billDetails[0]?.toPeriod) || "NA"} />
              <Row label={t("CR_RECEIPT_AMOUNT")} text={'₹' + PaymentReceipt?.totalAmountPaid || "NA"} />
              <Row label={t("CR_RECEIPT_PENDING_AMOUNT")} text={'₹' + (pendingDue) || "₹0"} />
              <Row label={t("CR_RECEIPT_PAYMENT_MODE")} text={PaymentReceipt?.paymentMode ? t(`COMMON_MASTERS_PAYMENTMODE_${PaymentReceipt?.paymentMode}`) || "NA" : "NA"} />
              <Row label={t("CR_RECEIPT_TXN_ID")} text={PaymentReceipt?.transactionNumber || "NA"} />
              <Row label={t("CR_RECEIPT_G8_RECEIPT_NO")} text={PaymentReceipt?.paymentDetails[0]?.manualReceiptNumber || "NA"} />
              <Row label={t("CR_RECEIPT_G8_RECEIPT_DATE")} text={convertEpochToDate(PaymentReceipt?.paymentDetails[0]?.manualReceiptDate) || "NA"} />
            </StatusTable>
          </Card>
        </div>
      ) : null}
      {showModal ? (
        <ActionModal t={t} tenantId={tenantId} applicationData={data} closeModal={closeModal} submitAction={submitAction} />
      ) : null}
      <ActionBar>
        {canCancelReceipt(PaymentReceipt) && <SubmitBar label={t("CR_CANCEL_RECEIPT_BUTTON")} onSubmit={() => cancelReceipt()} />}
      </ActionBar>
    </React.Fragment>
  );
};

export default ReceiptDetails;
