import React from "react";
import { Card, Banner, CardText, SubmitBar } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const GetActionMessage = ({ action }) => {
  const { t } = useTranslation();
  switch (action) {
    case "REOPEN":
      return t(`CS_COMMON_COMPLAINT_REOPENED`);
    case "RATE":
      return t("CS_COMMON_THANK_YOU");
    default:
      return t(`CS_COMMON_COMPLAINT_SUBMITTED`);
  }
};

const BannerPicker = () => {
  return <Banner message={GetActionMessage("SUCCESS")} complaintNumber="FSM-11122020-00789" successful={true} />;
};

const Response = (props) => {
  const { t } = useTranslation();
  return (
    <Card>
      <BannerPicker />
      <CardText>{t("CS_COMMON_TRACK_COMPLAINT_TEXT")}</CardText>
      <Link to={`${props.parentRoute}/`}>
        <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
      </Link>
    </Card>
  );
};

export default Response;
