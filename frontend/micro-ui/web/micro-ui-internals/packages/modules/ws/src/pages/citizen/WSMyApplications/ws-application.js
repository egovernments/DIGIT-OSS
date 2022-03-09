import { Card, KeyNote, SubmitBar } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const WSApplication = ({ application }) => {
  console.log("application",application)
  const { t } = useTranslation();
  let encodeApplicationNo = encodeURI(application.applicationNo)
  let workflowDetails = Digit.Hooks.useWorkflowDetails({
    tenantId: application?.tenantId,
    id: application?.applicationNo,
    moduleCode: "WS",
    config: {
      enabled: !!application?.applicationNo
    }
  });
  console.log(workflowDetails,"workflowDetails")
  return (
    <Card>
    <KeyNote keyValue={t("Application Number")} note={application?.applicationNo} />
    <KeyNote keyValue={t("Service Name")} note={application?.applicationType} />
    <KeyNote keyValue={t("Consumer Name")} note={application?.connectionHolders?.map((owner) => owner.name).join(",")} />
    <KeyNote keyValue={t("Property Id")} note={application?.propertyId} />
    <KeyNote keyValue={t("Status")} note={application?.applicationStatus} />
    <KeyNote keyValue={t("SLA")} note={`${Math.round(workflowDetails?.data?.processInstances?.[0]?.businesssServiceSla / (24 * 60 * 60 * 1000)) || "-"} Days`} />
    <KeyNote keyValue={t("Property Address")} note={application?.connectionHolders?.[0]?.permanentAddress } />
      <Link to={`/digit-ui/citizen/ws/connection/application/${encodeApplicationNo}`}>
        <SubmitBar label={t("View Details")} />
      </Link>
    </Card>
  );
};

export default WSApplication;
