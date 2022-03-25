import { Card, KeyNote, SubmitBar } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { convertEpochToDate, DownloadReceipt } from "../../../utils/index";
const WSPayments = ({ application }) => {

  const { t } = useTranslation();
  return (
    <Card>
      
      <KeyNote noteStyle={{fontSize:"24px", fontWeight:"700"}} keyValue={t("CS_PAYMENT_AMOUNT_DUE_WITHOUT_SYMBOL")} note={`₹ ${application?.paymentDetails?.[0]?.totalAmountPaid}`} />
      <KeyNote keyValue={t("WS_SERVICE_NAME_LABEL")} note={t(`WS_APPLICATION_TYPE_${application?.applicationType}`)} />
      <KeyNote keyValue={t("WS_CONSUMER_CODE")} note={t(application?.paymentDetails?.[0]?.bill?.consumerCode)} />
      <KeyNote keyValue={t("WS_CONSUMER_NAME")} note={application?.payerName} />
      <KeyNote keyValue={t("WS_RECEIPT_NO_LABEL")} note={t(application?.paymentDetails?.[0]?.receiptNumber)} />
      <KeyNote keyValue={t("WS_RECEIPT_DATE_LABEL")} note={convertEpochToDate(application?.paymentDetails?.[0]?.receiptDate) || t("CS_NA")} />

      <SubmitBar
        label={t("WS_DOWNLOAD_RECEIPT")}
        onSubmit={(e) => DownloadReceipt(application?.paymentDetails?.[0]?.bill?.consumerCode, application?.tenantId, "SW")}
      />
    </Card>
  );
};

export default WSPayments;