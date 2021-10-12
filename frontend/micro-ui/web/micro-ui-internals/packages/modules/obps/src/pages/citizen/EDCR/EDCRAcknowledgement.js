import { Banner, Card, CardText, LinkButton, SubmitBar } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

const EDCRAcknowledgement = (props) => {
  sessionStorage.setItem("isPermitApplication", true);
  const edcrData = props?.data?.[0];
  const { t } = useTranslation();
  const history = useHistory();
  const [bpaLinks, setBpaLinks] = useState({});
  const state = Digit.ULBService.getStateId();
  const isMobile = window.Digit.Utils.browser.isMobile();
  const { data:homePageUrlLinks , isLoading: homePageUrlLinksLoading } = Digit.Hooks.obps.useMDMS(state, "BPA", ["homePageUrlLinks"]);

  useEffect(() => {
    if (!homePageUrlLinksLoading && homePageUrlLinks?.BPA?.homePageUrlLinks?.length > 0) {
        let uniqueLinks = [];
        homePageUrlLinks?.BPA?.homePageUrlLinks?.map(linkData => {
            if(linkData?.applicationType === edcrData?.appliactionType && linkData?.serviceType === edcrData?.applicationSubType){
              setBpaLinks({
                linkData: linkData,
                edcrNumber: edcrData?.edcrNumber
              });
            }
        });
    }
}, [!homePageUrlLinksLoading]);


  const printReciept = async () => {
    var win = window.open(edcrData.planReport, '_blank');
    if (win) {
      win.focus();
    }
  };

  const routeToBPAScreen = async () => {
    history.push(
      `/digit-ui/citizen/obps/bpa/${edcrData?.appliactionType?.toLowerCase()}/${edcrData?.applicationSubType?.toLowerCase()}/docs-required`,
      { edcrNumber: edcrData?.edcrNumber }
    );
    // window.location.assign(`${window.location.origin}/digit-ui/citizen/obps/new-building-permit/docs-required`);
  }

  return (
    <div>
      {edcrData.status == "Accepted" ?
        <Card style={{ padding: "0px" }}>
          <Banner
            message={t("EDCR_ACKNOWLEDGEMENT_SUCCESS_MESSAGE_LABEL")}
            applicationNumber={edcrData?.edcrNumber}
            info={t("EDCR_SCRUTINY_NUMBER_LABEL")}
            successful={true}
            infoStyles = {{fontSize: "18px", lineHeight: "21px", fontWeight: "bold", textAlign: "center", padding: "0px 15px"}}
            applicationNumberStyles = {{fontSize: "24px", lineHeight: "28px", fontWeight: "bold", marginTop: "10px"}}
            style={isMobile ? { padding: "10px" }: {width: "100%", padding: "10px"}}
          />
          <CardText style={{ padding: "0px 8px", marginBottom: "10px" }}>{`${t("PDF_STATIC_LABEL_CONSOLIDATED_BILL_CONSUMER_ID_TL")} - ${edcrData?.applicationNumber}`}</CardText>
          <div className="primary-label-btn d-grid" style={{ marginLeft: "unset", marginBottom: "10px", padding: "0px 8px" }} onClick={printReciept}>
            <svg width="20" height="23" viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.3334 8H14V0H6.00002V8H0.666687L10 17.3333L19.3334 8ZM0.666687 20V22.6667H19.3334V20H0.666687Z" fill="#F47738" />
            </svg>
            {t("EDCR_DOWNLOAD_SCRUTINY_REPORT_LABEL")}
          </div>
          <div style={{padding: "0px 10px"}}>
            <Link to={{pathname: `/digit-ui/citizen/obps/${bpaLinks?.linkData?.flow?.toLowerCase()}/${edcrData?.appliactionType?.toLowerCase()}/${edcrData?.applicationSubType?.toLowerCase()}/docs-required`, state: bpaLinks}} >
              <SubmitBar label={t("BPA_APPLY_FOR_BPA_LABEL")} />
            </Link>
            <CardText  style={isMobile ? {display:"flex", justifyContent: "center", marginBottom: "0px"} : {}}>{t("BPA_FOR_NEW_CONSTRUCTION_LABEL")}</CardText>
            <div style={{marginTop: "12px", paddingBottom: "10px"}}>
              <Link to={`/digit-ui/citizen`} >
                <LinkButton label={t("CORE_COMMON_GO_TO_HOME")} />
              </Link>
            </div>
          </div>    
        </Card> :
        <Card style={{ padding: "0px" }}>
          <Banner
            message={t("EDCR_ACKNOWLEDGEMENT_REJECTED_MESSAGE_LABEL")}
            applicationNumber={edcrData?.applicationNumber}
            info={t("EDCR_ACKNOWLEDGEMENT_SUCCESS_SUB_MESSAGE_LABEL")}
            successful={false}
            infoStyles = {{fontSize: "18px", lineHeight: "21px", fontWeight: "bold", textAlign: "center", padding: "0px 15px"}}
            applicationNumberStyles = {{fontSize: "24px", lineHeight: "28px", fontWeight: "bold", marginTop: "10px"}}
            style={{ padding: "10px" }}
          />
          <CardText style={{ padding: "0px 8px" }}>{t("EDCR_ACKNOWLEDGEMENT_REJECTED_MESSAGE_TEXT_LABEL")}</CardText>
          <div className="primary-label-btn d-grid" style={{ marginLeft: "unset", marginBottom: "10px", padding: "0px 8px" }} onClick={printReciept}>
            <svg width="20" height="23" viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.3334 8H14V0H6.00002V8H0.666687L10 17.3333L19.3334 8ZM0.666687 20V22.6667H19.3334V20H0.666687Z" fill="#F47738" />
            </svg>
            {t("EDCR_DOWNLOAD_SCRUTINY_REPORT_LABEL")}
          </div>
          <div style={{padding: "10px", paddingBottom: "10px"}}>
            <Link to={`/digit-ui/citizen`} >
              <SubmitBar label={t("CORE_COMMON_GO_TO_HOME")} />
            </Link>
          </div>
        </Card>
      }

    </div>
  );
};
export default EDCRAcknowledgement;