import { Banner, Card, CardText, SubmitBar, ActionBar } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import * as func from "../../../utils"
import getWSDisconectionAcknowledgementData from "../../../utils/getWSDisconnectionAcknowledgementData"

const WSDisconnectionResponse = (props) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const history = useHistory();
  let filters = func.getQueryStringParams(location.search);

  const disconnectionData = Digit.SessionStorage.get("WS_DISCONNECTION");

  const handleDownloadPdf = () => {
    const disconnectionRes = disconnectionData?.DisconnectionResponse
    const PDFdata = getWSDisconectionAcknowledgementData(disconnectionRes, disconnectionData?.propertyDetails, disconnectionRes?.tenantId, t);
    PDFdata.then((res) => Digit.Utils.pdf.generatev1(res));
  };
  
  const onSubmit = () => {
    history.push(`/digit-ui/employee`);
  }

  return (
    <div>
      <Card>
        <Banner
          message={t("WS_APPLICATION_SUBMITTED_SUCCESSFULLY_LABEL")}
          applicationNumber={filters?.applicationNumber}
          info={filters?.applicationNumber?.includes("WS") ? t("WS_WATER_APPLICATION_NUMBER_LABEL") : t("WS_SEWERAGE_APPLICATION_NUMBER_LABEL")}
          successful={true}
          style={{ padding: "10px" }}
          headerStyles={{ fontSize: "32px" }}
          infoOneStyles={{ paddingTop: "20px" }}
        />
        <CardText style={{ paddingBottom: "10px", marginBottom: "10px" }}>{t("WS_MESSAGE_SUB_DESCRIPTION_LABEL")}</CardText>
        <div style={{ display: "flex" }}>
         <div className="primary-label-btn d-grid" style={{ marginLeft: "unset", marginBottom: "10px", padding: "0px 8px" }} onClick={handleDownloadPdf}>
            <svg width="20" height="23" viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.3334 8H14V0H6.00002V8H0.666687L10 17.3333L19.3334 8ZM0.666687 20V22.6667H19.3334V20H0.666687Z" fill="#F47738" />
            </svg>
            {t("WS_PRINT_APPLICATION_LABEL")}
          </div>
        </div>

        <ActionBar style={{ display: "flex", justifyContent: "flex-end", alignItems: "baseline" }}>
          <SubmitBar
            label={t("CORE_COMMON_GO_TO_HOME")}
            onSubmit={onSubmit}
            style={{ margin: "10px 10px 0px 0px" }}
          />
        </ActionBar>
      </Card>
    </div>
  );
};
export default WSDisconnectionResponse;