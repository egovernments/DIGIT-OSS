import { Banner, Card, CardText, ActionBar, SubmitBar } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";


const StakeholderResponse = (props) => {
  const { state } = props.location;
  const { t } = useTranslation();
  const bparegData = state?.data?.Licenses?.[0];
  const typeofStakeholder = bparegData?.tradeLicenseDetail?.tradeUnits?.[0]?.tradeType?.split('.')[0]

  const getHeaderMessage = () => {
    return t(`BPA_${typeofStakeholder ? typeofStakeholder : "ARCHIETCT"}_${bparegData?.action}_MAIN_HEAD`)
  }

  const getSubHeaderMessage = () => {
    return t(`BPA_${typeofStakeholder ? typeofStakeholder : "ARCHIETCT"}_${bparegData?.action}_SUB_MAIN_HEAD`)
  }

  return (
    <div>
      <Card>
        <Banner
          message={getHeaderMessage()}
          applicationNumber={bparegData?.applicationNumber}
          info={t("BPA_APPLICATION_NUMBER_LABEL")}
          successful={bparegData?.status == "REJECTED" ? false : true}
        />
        <CardText style={{ paddingBottom: "10px", marginBottom: "10px" }}>{getSubHeaderMessage()}</CardText>
        <ActionBar style={{ display: "flex", justifyContent: "flex-end", alignItems: "baseline" }}>
          <SubmitBar
            label={t("CORE_COMMON_GO_TO_HOME")}
          />
        </ActionBar>
      </Card>
    </div>
  );
};
export default StakeholderResponse;