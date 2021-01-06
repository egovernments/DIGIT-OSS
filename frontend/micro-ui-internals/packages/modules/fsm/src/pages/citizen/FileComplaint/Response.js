import React from "react";
import { Card, Banner, CardText, SubmitBar } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Loader } from "@egovernments/digit-ui-react-components";

const GetActionMessage = () => {
  const { t } = useTranslation();
  return t("CS_FILE_DESLUDGING_APPLICATION_SUCCESS");
};

const BannerPicker = (props) => {
  return <Banner message={GetActionMessage()} complaintNumber={props.data?.fsm[0].applicationNo} successful={props.isSuccess} />;
};

const Response = () => {
  const { t } = useTranslation();
  const { data, error, isLoading, isSuccess, status } = Digit.Hooks.fsm.useDesludging("data", "pb.amritsar");
  // console.log("data ------------------>", data, error, isLoading, isSuccess, status);
  return isLoading ? (
    <Loader />
  ) : (
    <Card>
      <BannerPicker data={data} isSuccess={isSuccess} isLoading={isLoading} />
      <CardText>{t("CS_COMMON_TRACK_COMPLAINT_TEXT")}</CardText>
      <Link to={`/digit-ui/citizen`}>
        <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
      </Link>
    </Card>
  );
};

export default Response;
