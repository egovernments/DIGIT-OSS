import { Card, KeyNote, SubmitBar } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const WSApplication = ({ application }) => {
  const { t } = useTranslation();
  return (
    <Card>
    <KeyNote keyValue={t("Application Number")} note={"WS- 767 - 23 - 213433"} />
    <KeyNote keyValue={t("Service Name")} note={t("Water ")} />
    <KeyNote keyValue={t("Property Address")} note={"****, Ajit Nagar, City A"} />
    <KeyNote keyValue={t("Status")} note={"Due for Payment"} />
      <Link to={`/digit-ui/citizen/ws/connection/application/${application?.acknowldgementNumber}`}>
        <SubmitBar label={t("View Details")} />
      </Link>
    </Card>
  );
};

export default WSApplication;
