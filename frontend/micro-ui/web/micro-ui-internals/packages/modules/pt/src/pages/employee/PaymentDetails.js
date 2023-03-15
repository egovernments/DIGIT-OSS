import { Card, CardText, Header, LinkLabel, Loader, Row, StatusTable } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
const printReciept = async (businessService, receiptNumber) => {
  await Digit.Utils.downloadReceipt(null, businessService, "consolidatedreceipt", undefined, receiptNumber);
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
  let { id: applicationNumber } = useParams();
  const index = applicationNumber.indexOf("?")
  if(index!=-1) applicationNumber = applicationNumber.slice(0,index)
  const [paymentObject, setPaymentObject] = useState([]);
  const isMobile = window.Digit.Utils.browser.isMobile();

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
      <div style={{ display: "flex", paddingBottom: "8px", marginBottom: "8px" }}>
        <h2 style={isMobile ? {marginLeft:"15px", fontSize: "16px", lineHeight: "24px", width: "30%", fontWeight: "700" } : { fontSize: "16px", lineHeight: "24px", width: "30%", fontWeight: "700" }}>{t("PT_PROPERTY_PTUID")}</h2>
        <div style={{ whiteSpace: "pre", width: "50%", fontSize: "16px", lineHeight: "24px" }}>{applicationNumber}</div>
      </div>
      {paymentObject.length>0 ? paymentObject?.map((payment) => (
        <div style={isMobile ? {} : { marginLeft: "-16px" }}>
          <Card style={isMobile ? {marginBottom:"10px"} : {}}>
            <StatusTable>
              <Row label={t("PT_HISTORY_BILL_PERIOD")} text={payment?.billPeriod} textStyle={{ whiteSpace: "pre" }} />
              <Row label={t("PT_HISTORY_BILL_NO")} text={payment?.billNo} textStyle={{ whiteSpace: "pre" }} />
              <Row label={t("PT_HISTORY_RECEIPT_NO")} text={payment?.receiptNumber} textStyle={{ whiteSpace: "pre" }} />
              <Row label={t("PT_HISTORY_PAYMENT_DATE")} text={payment?.transactionDate} textStyle={{ whiteSpace: "pre" }} />
              <Row label={t("PT_HISTORY_AMOUNT_PAID")} text={payment?.amountPaid} />
              <Row label={t("PT_HISTORY_PAYMENT_STATUS")} text={t(payment?.paymentStatus)} textStyle={{ whiteSpace: "pre" }} />
              <LinkLabel style={isMobile ? {marginLeft:"0px"} : {}} onClick={() => printReciept("PT", payment?.receiptNumber)}>{t("PT_DOWNLOAD_RECEIPT")}</LinkLabel>
            </StatusTable>
          </Card>
        </div>
      )):<div>
        <CardText>{t("PT_NO_PAYMENTS_HISTORY")}</CardText>
        </div>}
    </React.Fragment>
  );
};

export default PaymentDetails;
