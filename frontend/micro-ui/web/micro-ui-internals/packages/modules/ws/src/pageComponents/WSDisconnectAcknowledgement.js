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

// const rowContainerStyle = {
// padding: "4px 0px",
// justifyContent: "space-between",
// };

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

  const handleDownloadPdf = () => {
    // const WSmutationdata = WSmutation?.data?.WaterDisconnection?.[0];
    // const SWmutationdata = SWmutation?.data?.SewerageDisconnections?.[0];
    // const tenantInfo = tenants.find((tenant) => tenant.code === data?.cpt?.details?.tenantId);
    // if(data?.serviceName?.code === "WATER")
    // {
    // const data1 = getPDFData({...WSmutationdata},data,tenantInfo, t);
    // Digit.Utils.pdf.generate(data1);
    // }
    // else if(data?.serviceName?.code === "SEWERAGE")
    // {
    // const data2 = getPDFData({...SWmutationdata},data,tenantInfo, t);
    // Digit.Utils.pdf.generate(data2);
    // }
    // else
    // {
    // const data1 = getPDFData({...WSmutationdata},data,tenantInfo, t);
    // const data2 = getPDFData({...SWmutationdata},data,tenantInfo, t);
    // Digit.Utils.pdf.generate(data1);
    // Digit.Utils.pdf.generate(data2);
    // }
  };

  return (
    <Card style={{ padding: "10px" }}>
      <CardSectionHeader>
        {" "}
        <BannerPicker t={t} /> <successSvg />
      </CardSectionHeader>
      <CardText>
        The Notification number along with the application number is sent to your registered mobile number. you can make payment later using Track
        application Link from Home page once you recieve the message you make payement in your mobile phone.
      </CardText>

      {<SubmitBar label={t("WS_DOWNLOAD_ACK_FORM")} onSubmit={handleDownloadPdf} />}
      <Link to={`/digit-ui/citizen`}>
        <LinkButton label={t("CORE_COMMON_GO_TO_HOME")} />
      </Link>
    </Card>
  );
};

export default WSDisconnectAcknowledgement;
