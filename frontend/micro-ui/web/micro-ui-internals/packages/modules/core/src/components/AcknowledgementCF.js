import { Banner, Card, CardText, LinkButton, Loader, Row, StatusTable, SubmitBar } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

const GetActionMessage = (props) => {
  const { t } = useTranslation();
  if (props?.isSuccess) {
    return  t("CS_PROPERTY_FEEDBACK_SUCCESS");
  } 
  else {
    return t("CS_PROPERTY_FEEDBACK_FAILED")
  }
};

const rowContainerStyle = {
  padding: "4px 0px",
  justifyContent: "space-between",
};

const BannerPicker = (props) => {
  return (
    <Banner
      message={GetActionMessage(props)}
      applicationNumber={""}
      style = {props.isMobile ? {width : "unset"} : {width:"740px"}}
      //info={props.isSuccess ? props.t("PT_APPLICATION_NO") : ""}
      successful={props?.isSuccess}
    />
  );
};

const AcknowledgementCF = ({ data, onSuccess }) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const location = useLocation();
  const { data: storeData } = Digit.Hooks.useStore.getInitData();
  const { tenants } = storeData || {};
  const isMobile = window.Digit.Utils.browser.isMobile();

  return (
    <form>
    <Card style={isMobile ? {padding:"unset"} : {}}>
      <BannerPicker t={t} data={location.state} isSuccess={location.state?.result?.Service?.[0]?true : false} isMobile={isMobile} isLoading={/*mutation.isIdle || mutation.isLoading*/ false} />
      {location.state?.result?.Service?.[0] && <CardText style={{padding:"0px 10px 0px 10px"}}>{t("CS_CF_FEEDBACK_RESPONSE")}</CardText>}
      {!(location.state?.result?.Service?.[0]) && <CardText>{t("CS_FILE_PROPERTY_FAILED_RESPONSE")}</CardText>}
      <div style={{padding:"0px 10px 20px 10px"}}>
      <Link to={`/digit-ui/citizen`}>
        <SubmitBar label={t("CS_COMMON_GO_BACK_TO_HOME")} />
      </Link>
      </div>
    </Card>
    </form>
  );
};

export default AcknowledgementCF;