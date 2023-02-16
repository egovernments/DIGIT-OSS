import { Banner, Card, CardText, ActionBar, SubmitBar } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";


const StakeholderResponse = (props) => {
  const { state } = props.location;
  const { t } = useTranslation();
  const history = useHistory();
  const bparegData = state?.data?.Licenses?.[0];
  const typeofStakeholder = bparegData?.tradeLicenseDetail?.tradeUnits?.[0]?.tradeType?.split('.')[0]

  const getHeaderMessage = () => {
    return t(`BPA_ARCHITECT_${bparegData?.status}_MAIN_HEAD`)
  }

  const getSubHeaderMessage = () => {
    return t(`BPA_ARCHITECT_${bparegData?.status}_SUB_MAIN_HEAD`)
  }

  const onSubmit = () => {
    history.push(`/digit-ui/employee`);
  }

  return (
    <div>
      <Card>
        <Banner
          message={getHeaderMessage()}
          applicationNumber={bparegData?.applicationNumber}
          info={t("BPA_NEW_STAKEHOLDER_REGISTRATION_APP_LABEL")}
          successful={bparegData?.status == "REJECTED" ? false : true}
          style={{ padding: "10px" }}
          headerStyles={{fontSize: "32px", wordBreak: "break-word"}}
        />
        <CardText style={{ paddingBottom: "10px", marginBottom: "10px" }}>{getSubHeaderMessage()}</CardText>
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
export default StakeholderResponse;