import { Card, Header, LinkLabel, Loader, Row, StatusTable } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

const printReciept = async (businessService, consumerCode) => {
  await Digit.Utils.downloadReceipt(consumerCode, businessService, "consolidatedreceipt");
};
const getFormattedDate = (date) => {
  const dateArray = new Date(date).toString().split(" ");
  if (dateArray.length > 0) {
    return dateArray[2] + "-" + dateArray[1] + "-" + dateArray[3];
  } else {
    return "dd-mmm-yyyy";
  }
};

const getBillPeriod = (billDetails = []) => {
  let latest = billDetails.sort((x, y) => y.fromPeriod - x.fromPeriod);
  const billPeriod = getFormattedDate(latest[latest.length - 1].fromPeriod) + " to " + getFormattedDate(latest[0].toPeriod);
  return billPeriod;
};

const PaymentDetails = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { id: applicationNumber } = useParams();
  const [paymentObject, setPaymentObject] = useState([]);

  const { isLoading, isError, error, data } = Digit.Hooks.receipts.useReceiptsSearch(
    { businessServices: "PT", consumerCodes: applicationNumber },
    tenantId,
    [],
    false
  );
  useEffect(() => {
    if (data) {
      setPaymentObject(
        data?.Payments?.map((payment) => {
          return {
            receiptNumber: payment.paymentDetails[0].receiptNumber,
            billPeriod: getBillPeriod(payment.paymentDetails[0].bill.billDetails),
            transactionDate: getFormattedDate(payment.transactionDate),
            billNo: payment.paymentDetails[0].bill.billNumber,
            paymentStatus: payment.paymentStatus ? `CS_${payment.paymentStatus}` : "PT_NA",
            amountPaid: payment.totalAmountPaid === 0 ? "0" : payment.totalAmountPaid,
          };
        })
      );
    }
  }, [data]);
  if (isLoading) {
    return <Loader />;
  }

  return (
    <React.Fragment>
     
        <Header>{t("PT_PAYMENT_HISTORY")}</Header>
        {t("PT_PROPERTY_PTUID")} {applicationNumber}
      {paymentObject?.map((payment) => (
         <div style={{ marginLeft: "-16px" }}>
        <Card>
          <StatusTable>
            <Row label={t("PT_HISTORY_BILL_NO")} text={payment?.billNo} textStyle={{ whiteSpace: "pre" }} />
            <Row label={t("PT_HISTORY_BILL_PERIOD")} text={payment?.billPeriod} textStyle={{ whiteSpace: "pre" }} />
            <Row label={t("PT_HISTORY_RECEIPT_NO")} text={payment?.receiptNumber} textStyle={{ whiteSpace: "pre" }} />
            <Row label={t("PT_HISTORY_PAYMENT_DATE")} text={payment?.transactionDate} textStyle={{ whiteSpace: "pre" }} />
            <Row label={t("PT_HISTORY_PAYMENT_STATUS")} text={t(payment?.paymentStatus)} textStyle={{ whiteSpace: "pre" }} />
            <Row label={t("PT_HISTORY_AMOUNT_PAID")} text={payment?.amountPaid} />
            <LinkLabel onClick={() => printReciept("PT", applicationNumber)}>{t("PT_DOWNLOAD_RECEIPT")}</LinkLabel>
          </StatusTable>
        </Card>
        </div>
      ))}
    </React.Fragment>
  );
};

export default PaymentDetails;
