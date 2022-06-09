import React, { useEffect } from "react";
import { Banner, Card, CardSectionHeader, CardText, LinkButton, SubmitBar, successSvg } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { pdfDocumentName, pdfDownloadLink } from "../utils";

const GetActionMessage = (props) => {
  const { t } = useTranslation();
  if (props.isSuccess) {
    return t("APPLICATION_COMPLETED");
  } else if (!props.isSuccess) {
    return t("APPLICATION_FAILED");
  }
};

const BannerPicker = (props) => {
  return <Banner message={GetActionMessage(props)} successful={props.isSuccess} />;
};

const WSDisconnectAcknowledgement = ({ data, t, onSuccess, clearParams}) => {
  let isEdit = window.location.href.includes("/edit-application/") || window.location.href.includes("/modify-disconnection/");
  let isDownload = window.location.href.includes("/download-pdf/") || window.location.href.includes("/disconnect-Acknowledge/");
  const { data: storeData } = Digit.Hooks.useStore.getInitData();
  const { tenants } = storeData || {};
  const stateId = Digit.ULBService.getStateId();
  useEffect(() => {
    try {
      const tenantId = Digit.ULBService.getStateId();
      const { isLoading: wsDocsLoading, data: wsDocs } = Digit.Hooks.ws.WSSearchMdmsTypes.useWSServicesMasters(tenantId, "DisconnectionDocuments");
      if (data?.serviceName?.code === "WATER" || data?.serviceName?.code === "BOTH") {
        tenantId = data?.cpt?.details?.tenantId || tenantId;

        let forminfo = isDownload ? pdfDocumentName(data) : pdfDownloadLink(data);
      }
    } catch (err) {}
  }, [data]);

  const handleDownloadPdf = () => {};

  return (
    <Card style={{ padding: "10px" }}>
      <CardSectionHeader>
        {" "}
        <BannerPicker t={t} /> <successSvg />
      </CardSectionHeader>
      <CardText>
        {t('WS_DISCONNECTION_APPLICATION_SUCC_MSG')}
      </CardText>
      {<SubmitBar label={t("WS_DOWNLOAD_ACK_FORM")} onSubmit={handleDownloadPdf} />}
      <Link to={`/digit-ui/citizen`}>
        <LinkButton label={t("CORE_COMMON_GO_TO_HOME")} />
      </Link>
    </Card>
  );
};

export default WSDisconnectAcknowledgement;
