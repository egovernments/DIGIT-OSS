import React from "react";
import { useTranslation } from "react-i18next";
import { Card, KeyNote, SubmitBar } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";

const MyApplication = ({ application }) => {
  const { t } = useTranslation();
  return (
    <Card>
      <KeyNote keyValue={t("CS_APPLICATION_NO")} note={application.complaintNo} />
      <KeyNote keyValue={t("CS_SERVICE_CATEGORY")} note={application.serviceCategory} />
      <KeyNote keyValue={t("CS_APPLICATION_TYPE")} note={application.applicationType} />
      <KeyNote keyValue={t("CS_STATUS")} note={application.status} />
      <Link to="/digit-ui/citizen/fsm/application-details">
        <SubmitBar label={t("CS_VIEW")} />
      </Link>
    </Card>
  );
};

export default MyApplication;
