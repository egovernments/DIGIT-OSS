import { Banner, Card, CardText, ActionBar, SubmitBar } from "@egovernments/digit-ui-react-components";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { stringReplaceAll } from "../../utils";

const Response = (props) => {
  const { state } = props.location;
  const { t } = useTranslation();
  const history = useHistory();
  const nocData = state?.data?.Noc?.[0];

  const onSubmit = () => {
    history.push(`/digit-ui/employee`);
  }

  return (
    <div>
      <Card>
        <Banner
          message={t(`NOC_${stringReplaceAll(nocData?.nocType, ".", "_")}_${stringReplaceAll(nocData?.applicationStatus, ".", "_")}_HEADER`)}
          applicationNumber={nocData?.applicationNo}
          info={t("NOC_APP_NO_LABEL")}
          successful={true}
        />
        <CardText>{t(`NOC_${stringReplaceAll(nocData?.nocType, ".", "_")}_${stringReplaceAll(nocData?.applicationStatus, ".", "_")}_SUB_HEADER`)}</CardText>
        <ActionBar style={{ display: "flex", justifyContent: "flex-end", alignItems: "baseline" }}>
          <SubmitBar
            label={t("CORE_COMMON_GO_TO_HOME")}
            onSubmit={onSubmit}
          />
        </ActionBar>
      </Card>
    </div>
  );
};
export default Response;