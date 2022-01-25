import { Card, KeyNote, SubmitBar } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const WSApplication = ({ application }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();

  return (
    <Card>
      <KeyNote keyValue={t("WS_MYCONNECTIONS_APPLICATION_NO")} note={application?.applicationNo} />
      <KeyNote keyValue={t("WS_MYCONNECTIONS_SERVICE")} note={application?.applicationType} />
      <KeyNote keyValue={t("WS_PROPERTY_ID_LABEL")} note={application?.propertyId} />
      <KeyNote keyValue={t("WS_PROPERTY_ADDRESS_LABEL")} note={application?.connectionHolders[0]?.permanentAddress} />
      <KeyNote keyValue={t("WS_STATUS")} note={application?.applicationStatus} />
      <Link
        to={`/digit-ui/citizen/ws/connection/application-details?tenantId=${tenantId}&history=true&service=${application?.applicationType}&applicationNumber=${application.applicationNo}`}
      >
        <SubmitBar label={t("View Details")} />
      </Link>
    </Card>
  );
};

export default WSApplication;
