import React from "react";
import { useTranslation } from "react-i18next";
import { Card, KeyNote, SubmitBar } from "@egovernments/digit-ui-react-components";

const MyApplication = ({ application }) => {
  const { t } = useTranslation();
  return (
    <Card>
      <KeyNote keyValue={t("Application No.")} note={application.complaintNo} />
      <KeyNote keyValue={t("Service Category")} note={application.serviceCategory} />
      <KeyNote keyValue={t("Application Type")} note={application.applicationType} />
      <KeyNote keyValue={t("Status")} note={application.status} />
      <SubmitBar label="View" />
    </Card>
  );
};

export default MyApplication;
