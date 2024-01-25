import { Card, KeyNote, SubmitBar } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const PTApplication = ({ application, tenantId, buttonLabel }) => {
  const { t } = useTranslation();
  return (
    <Card>
      <KeyNote keyValue={t("PT_APPLICATION_NO_LABEL")} note={application?.acknowldgementNumber} />
      <KeyNote keyValue={t("PT_APPLICATION_CATEGORY")} note={t("PROPERTY_TAX")} />
      <KeyNote keyValue={t("PT_SEARCHPROPERTY_TABEL_PTUID")} note={application?.propertyId} />
      <KeyNote keyValue={t("PT_COMMON_TABLE_COL_APP_TYPE")} note={(application?.creationReason && t(`PT.${application.creationReason}`)) || t("CS_NA")} />
      <KeyNote keyValue={t("PT_COMMON_TABLE_COL_STATUS_LABEL")} note={t(`PT_COMMON_${application?.status}`)} />
      <Link to={`/digit-ui/citizen/pt/property/application/${application?.acknowldgementNumber}/${application?.tenantId}`}>
        <SubmitBar label={buttonLabel} />
      </Link>
    </Card>
  );
};

export default PTApplication;
