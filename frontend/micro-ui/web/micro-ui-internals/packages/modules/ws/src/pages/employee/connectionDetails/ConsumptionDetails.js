import { Card, Header, KeyNote, Loader, SubmitBar } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

const ConsumptionDetails = ({ view }) => {
  const { t } = useTranslation();
  const user = Digit.UserService.getUser();
  const tenantId = user?.info?.tenantId || Digit.ULBService.getCurrentTenantId();
  console.log(user)
  const {applicationNo} = Digit.Hooks.useQueryParams();
  let filter1 = { tenantId: tenantId, connectionNos:applicationNo };

  const { isLoading, isError, error, data } = Digit.Hooks.ws.useWSConsumptionSearch({ filters: filter1 }, { filters: filter1 });
 console.log(data)
  if (isLoading) {
    return <Loader />;
  }
  let {meterReadings} = data || {};
  return (
    <React.Fragment>
    <Header>{`${t("WS_VIEW_CONSUMPTION")}`}</Header>
    <div>
      {meterReadings?.length > 0 &&
        meterReadings.map((application, index) => (
          <div key={index}>
            <Card>
            <KeyNote keyValue={t("WS_MYCONNECTIONS_CONSUMER_NO")} note={application?.connectionNo} />
            <KeyNote keyValue={t("WS_VIEW_BILL_BILLING_PERIOD_LABEL")} note={application?.billingPeriod} />
            <KeyNote keyValue={t("WS_CONSUMPTION_DETAILS_METER_STATUS_LABEL")} note={application?.meterStatus} />
            <KeyNote keyValue={t("WS_CONSUMPTION_DETAILS_LAST_READING_LABEL")} note={application?.lastReading} />
            <KeyNote keyValue={t("WS_CONSUMPTION_DETAILS_LAST_READING_DATE_LABEL")} note={Digit.DateUtils.ConvertEpochToDate(application?.lastReadingDate)} />
            <KeyNote keyValue={t("WS_SERV_DETAIL_CUR_METER_READ")} note={application?.currentReading} />
            <KeyNote keyValue={t("WS_CONSUMPTION_DETAILS_CURRENT_READING_DATE_LABEL")} note={Digit.DateUtils.ConvertEpochToDate(application?.currentReadingDate)} />
            <KeyNote keyValue={t("WS_CONSUMPTION_DETAILS_CURRENT_READING_LABEL")} note={application?.consumption || t("CS_NA")} />
            </Card> 
          </div>
        ))}
      {!meterReadings?.length > 0 && <p style={{ marginLeft: "16px", marginTop: "16px" }}>{t("WS_NO_CONSUMPTION_FOUND")}</p>}
    </div>

  </React.Fragment>
  );
};
export default ConsumptionDetails;