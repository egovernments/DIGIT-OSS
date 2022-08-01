import { Banner, Card, CardText, SubmitBar, ActionBar } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import * as func from "../../../utils"

const WSDisconnectionResponse = (props) => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const history = useHistory();
  let filters = func.getQueryStringParams(location.search);
  
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