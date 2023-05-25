import React from "react";
import { useTranslation } from "react-i18next";
import { Card, KeyNote, SubmitBar } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";

const MyReceipt = ({ application }) => {
  const { t } = useTranslation();
  return (
    <Card>
      <KeyNote keyValue={t("PT_TRANSACTION_ID")} note={application.trasactionId} />
      <KeyNote keyValue={t("CS_COMMON_SERVICE_CATEGORY")} note={application.serviceCategory || t("ES_TITLE_FSM")} />
      <KeyNote keyValue={t("PT_AMOUNT_PAID")} note={application.amountPaid || t("CS_APPLICATION_TYPE_DESLUDGING")} />
      <KeyNote keyValue={t("PT_PAYMENT_DATE")} note={t(application.paymentDate)} />
      {/* <Link to={`/digit-ui/citizen/pt/property/bill-details/${application.propertId}`}> */}
      <SubmitBar label={t("CS_MY_APPLICATION_VIEW")} />
      {/* </Link> */}
    </Card>
  );
};

export default MyReceipt;
