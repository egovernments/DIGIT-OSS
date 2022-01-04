import React from "react";
import { Card, Banner, CardText, SubmitBar } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
// import { PgrRoutes, getRoute } from "../../../constants/Routes";
import { useTranslation } from "react-i18next";
import { ResponseComposer } from "@egovernments/digit-ui-react-components";

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
  // const { complaints } = response;

  // if (complaints && complaints.response && complaints.response.responseInfo) {
  return (
    <Banner
      message={response.actionMessage}
      complaintNumber={response.complaintNumber}
      successful={true}
    />
  );
  // } else {
  //   return <Banner message={t("CS_COMMON_COMPLAINT_NOT_SUBMITTED")} successful={false} />;
  // }
};

const Response = (props) => {
  const { t } = useTranslation();
  const [successData, setSuccessData, clearSuccessData] = Digit.Hooks.useSessionStorage("CF_RESPONSE", false);
  // const appState = useSelector((state) => state)["pgr"];
  let resp = JSON.stringify(successData.message)
  let temp = resp.split('\\n')
  let message = temp[2]
  let response = {
    actionMessage: temp[0].split('"')[1],
    complaintNumber: temp[1].split(' Complaint ID: ')[1]
  }

  return (
    <Card>
      <BannerPicker
        response={response}
        // response={appState}
      />
      <ResponseComposer />
      <CardText>{message}</CardText>
      <Link to="/digit-ui/citizen">
        <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
      </Link>
    </Card>
  );
};

export default Response;
