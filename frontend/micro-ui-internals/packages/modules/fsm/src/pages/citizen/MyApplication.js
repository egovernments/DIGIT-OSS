import React from "react";
import { useTranslation } from "react-i18next";
import { Card, KeyNote, SubmitBar } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";

const MyApplication = ({ application }) => {
  const { t } = useTranslation();
  return (
    <Card>
      <KeyNote keyValue={t("Application No.")} note={application.complaintNo} />
      <KeyNote keyValue={t("Service Category")} note={application.serviceCategory} />
      <KeyNote keyValue={t("Application Type")} note={application.applicationType} />
      <KeyNote keyValue={t("Status")} note={application.status} />
      <Link to="/digit-ui/citizen/fsm/application-details">
        <SubmitBar label="View" />
      </Link>
    </Card>
  );
};

export default MyApplication;
