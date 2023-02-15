import React, { useEffect } from "react";
import { Banner, Card, CardSectionHeader, CardText, LinkButton, SubmitBar, successSvg } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { pdfDocumentName, pdfDownloadLink } from "../utils";
import getWSDisconectionAcknowledgementData from "../utils/getWSDisconnectionAcknowledgementData";

const BannerPicker = (props) => {
  return <Banner 
  message={props.message} 
  applicationNumber={props?.applicationNumber}
  successful={props.isSuccess} style={{ padding: "10px" }}
  headerStyles={{ fontSize: "32px" }}
  infoOneStyles={{ paddingTop: "20px" }}/>;
};

const WSDisconnectAcknowledgement = () => {
  const { t } = useTranslation();
  // let isDownload = window.location.href.includes("/download-pdf/") || window.location.href.includes("/disconnect-Acknowledge/");
  const disconnectionData = Digit.SessionStorage.get("WS_DISCONNECTION");

  const handleDownloadPdf = () => {
    const disconnectionRes = disconnectionData?.DisconnectionResponse
    const PDFdata = getWSDisconectionAcknowledgementData(disconnectionRes, disconnectionData?.property, disconnectionRes?.tenantId, t);
    PDFdata.then((res) => Digit.Utils.pdf.generatev1(res));
  };

  return (
    <Card style={{ padding: "10px" }}>
      <CardSectionHeader>
        <BannerPicker isSuccess={true} message={t("WS_APPLICATION_COMPLETED_SUCCESSFULLY_LABEL")} applicationNumber={disconnectionData?.DisconnectionResponse?.applicationNo}/> <successSvg />
      </CardSectionHeader>
      <CardText>
        {t('WS_DISCONNECTION_APPLICATION_SUCC_MSG')}
      </CardText>
      {<SubmitBar label={t("WS_DOWNLOAD_ACK_FORM")} onSubmit={handleDownloadPdf} />}
      <Link to={`/digit-ui/citizen`}>
        <LinkButton label={t("CORE_COMMON_GO_TO_HOME")} onClick={() => Digit.SessionStorage.del("WS_DISCONNECTION")}/>
      </Link>
    </Card>
  );
};

export default WSDisconnectAcknowledgement;
