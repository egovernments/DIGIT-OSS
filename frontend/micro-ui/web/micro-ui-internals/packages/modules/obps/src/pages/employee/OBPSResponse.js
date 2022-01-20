import { Banner, Card, CardText, LinkButton, ActionBar, SubmitBar } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";


const OBPSResponse = (props) => {
  debugger;
  const { state } = props.location;
  const { t } = useTranslation();

  return (
    <div>
      <Card>
        <Banner
          message={t(`BPA_${state?.data?.BPA?.[0]?.workflow?.action}_MAIN_HEAD`)}
          applicationNumber={state?.data?.BPA?.[0]?.approvalNo}
          info={t("BPA_APPLICATION_NUMBER_LABEL")}
          successful={true}
        />
        <CardText style={{ paddingBottom: "10px", marginBottom: "10px" }}>{t(`BPA_${state?.data?.BPA?.[0]?.workflow?.action}_SUB_HEAD`)}</CardText>
        <ActionBar style={{ display: "flex", justifyContent: "flex-end", alignItems: "baseline" }}>
          <SubmitBar
            label={t("CORE_COMMON_GO_TO_HOME")}
          />
        </ActionBar>
      </Card>
    </div>
  );
};
export default OBPSResponse;