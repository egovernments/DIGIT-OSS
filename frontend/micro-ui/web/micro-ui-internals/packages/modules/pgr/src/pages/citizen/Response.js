import React from "react";
import { Card, Banner, CardText, SubmitBar } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { PgrRoutes, getRoute } from "../../constants/Routes";
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

const BannerPicker = ({ response }) => {
  const { complaints } = response;
  const { t } = useTranslation();
  if (complaints && complaints.response && complaints.response.responseInfo) {
    return (
      <Banner
        message={GetActionMessage(complaints.response.ServiceWrappers[0].workflow)}
        complaintNumber={complaints.response.ServiceWrappers[0].service.serviceRequestId}
        successful={true}
      />
    );
  } else {
    return <Banner message={t("CS_COMMON_COMPLAINT_NOT_SUBMITTED")} successful={false} />;
  }
};

const TextPicker = ({ response }) => {
  const { complaints } = response;
  const { t } = useTranslation();
  if (complaints && complaints.response && complaints.response.responseInfo) {
    const { action } = complaints.response.ServiceWrappers[0].workflow;
    return action === "RATE" ? <CardText>{t("CS_COMMON_RATING_SUBMIT_TEXT")}</CardText> : <CardText>{t("CS_COMMON_TRACK_COMPLAINT_TEXT")}</CardText>;
  }
};

const Response = (props) => {
  const { t } = useTranslation();
  const appState = useSelector((state) => state)["pgr"];
  return (
    <Card>
      {appState.complaints.response && <BannerPicker response={appState} />}
      {appState.complaints.response && <TextPicker response={appState} />}
      <Link to="/digit-ui/citizen">
        <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
      </Link>
    </Card>
  );
};

export default Response;
