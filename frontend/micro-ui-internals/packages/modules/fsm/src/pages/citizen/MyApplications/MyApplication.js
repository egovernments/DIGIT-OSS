import React from "react";
import { useTranslation } from "react-i18next";
import { Card, KeyNote, SubmitBar } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";

const MyApplication = ({ application }) => {
  const { t } = useTranslation();
  return (
    <Card>
      <KeyNote keyValue={t("CS_APPLICATION_NO")} note={application.applicationNo} />
      <KeyNote keyValue={t("CS_APPLICATION_DETAILS_SERVICE_CATEGORY")} note={application.serviceCategory || "FSM"} />
      <KeyNote keyValue={t("CS_APPLICATION_DETAILS_APPLICATION_TYPE")} note={application.applicationType || "Desludging Request"} />
      <KeyNote keyValue={t("CS_APPLICATION_DETAILS_STATUS")} note={t(application.applicationStatus)} />
      <Link to={`/digit-ui/citizen/fsm/application-details/${application.applicationNo}`}>
        <SubmitBar label={t("CS_VIEW")} />
      </Link>
    </Card>
  );
};

export default MyApplication;
