import { Card, KeyNote, SubmitBar } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getAddress } from "../../../utils/index";

const WSApplication = ({ application }) => {

  const { t } = useTranslation();
  let encodeApplicationNo = encodeURI(application.applicationNo)
  // let workflowDetails = Digit.Hooks.useWorkflowDetails({
  //   tenantId: application?.tenantId,
  //   id: application?.applicationNo,
  //   moduleCode: "WS",
  //   config: {
  //     enabled: !!application?.applicationNo
  //   }
  // });
  return (
    <Card>
    <KeyNote keyValue={t("WS_MYCONNECTIONS_APPLICATION_NO")} note={application?.applicationNo} />
    <KeyNote keyValue={t("WS_SERVICE_NAME")} note={t(`WS_APPLICATION_TYPE_${application?.applicationType}`)} />
    <KeyNote keyValue={t("WS_CONSUMER_NAME")} note={application?.connectionHolders?.map((owner) => owner.name).join(",") || application?.property?.owners?.map((owner) => owner.name).join(",") || t("CS_NA")} />
    <KeyNote keyValue={t("WS_PROPERTY_ID")} note={application?.propertyId || t("CS_NA")} />
    <KeyNote keyValue={t("WS_STATUS")} note={t(`CS_${application?.applicationStatus}`) || t("CS_NA")} />
    <KeyNote keyValue={t("WS_SLA")} note={Math.round(application?.sla / (24 * 60 * 60 * 1000)) ? `${Math.round(application?.sla / (24 * 60 * 60 * 1000))} Days` : t("CS_NA")} /> 
    <KeyNote keyValue={t("WS_PROPERTY_ADDRESS")} note={application?.connectionHolders?.[0]?.permanentAddress || getAddress(application?.property?.address, t) || t("CS_NA")} /> 
      <Link to={`/digit-ui/citizen/ws/connection/application/${encodeApplicationNo}`}>
        <SubmitBar label={t("WS_VIEW_DETAILS_LABEL")} />
      </Link>
    </Card>
  );
};

export default WSApplication;
