import { Card, KeyNote, SubmitBar } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const WSApplication = ({ application }) => {
  console.log("application",application)
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  return (
    <Card>
    <KeyNote keyValue={t("Application Number")} note={application?.applicationNo} />
    <KeyNote keyValue={t("Service Name")} note={application?.applicationType} />
    <KeyNote keyValue={t("Property Address")} note={application?.connectionHolders[0]?.permanentAddress } />
    <KeyNote keyValue={t("Status")} note={application?.applicationStatus} />
    <Link to={`/digit-ui/citizen/ws/connection/application-details?tenantId=${tenantId}&history=true&service=${application?.applicationType}&applicationNumber=${application.applicationNo}`}>
        <SubmitBar label={t("View Details")} />
      </Link>
    </Card>
  );
};

export default WSApplication;
