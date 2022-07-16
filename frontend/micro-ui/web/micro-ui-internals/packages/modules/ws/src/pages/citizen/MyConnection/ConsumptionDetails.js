import { Card, Header, KeyNote, Loader, StatusTable, SubmitBar, Row } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

const consumptionDetails = ({ view }) => {
  const { t } = useTranslation();
  const user = Digit.UserService.getUser();
  const tenantId = Digit.SessionStorage.get("CITIZEN.COMMON.HOME.CITY")?.code || user?.info?.permanentCity || Digit.ULBService.getCurrentTenantId();
  const {applicationNo} = Digit.Hooks.useQueryParams();
  let filter1 = { tenantId: tenantId, connectionNos:applicationNo };

  const { isLoading, isError, error, data } = Digit.Hooks.ws.useWSConsumptionSearch({ filters: filter1 }, { filters: filter1 });

  const  consumption = (currentReading, lastReading) => {
    if(currentReading && lastReading ){
      return Number(currentReading - lastReading);
    }
    else
    return t("NA");
  }
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
            <StatusTable>
            <Row className="border-none" label={t("WS_MYCONNECTIONS_CONSUMER_NO")} text={application?.connectionNo || t("NA")} textStyle={{}} />
            <Row className="border-none" label={t("WS_VIEW_BILL_BILLING_PERIOD_LABEL")} text={application?.billingPeriod || t("NA")} textStyle={{ wordBreak:"break-word" }} />
            <Row className="border-none" label={t("WS_CONSUMPTION_DETAILS_METER_STATUS_LABEL")} text={application?.meterStatus || t("NA")} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none" label={t("WS_CONSUMPTION_DETAILS_LAST_READING_LABEL")} text={application?.lastReading || t("NA")} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none" label={t("WS_CONSUMPTION_DETAILS_LAST_READING_DATE_LABEL")} text={Digit.DateUtils.ConvertEpochToDate(application?.lastReadingDate) || t("NA")} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none" label={t("WS_CONSUMPTION_DETAILS_CURRENT_READING_LABEL")} text={application?.currentReading || t("NA")} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none" label={t("WS_CONSUMPTION_DETAILS_CURRENT_READING_DATE_LABEL")} text={Digit.DateUtils.ConvertEpochToDate(application?.currentReadingDate) || t("NA")} textStyle={{ whiteSpace: "pre" }} />
            <Row className="border-none" label={t("WS_CONSUMPTION_DETAILS_CONSUMPTION_LABEL")} text={consumption(application?.currentReading, application?.lastReading )} textStyle={{ whiteSpace: "pre" }} />
            </StatusTable>
            </Card> 
          </div>
        ))}
      {!meterReadings?.length > 0 && <p style={{ marginLeft: "16px", marginTop: "16px" }}>{t("WS_NO_CONSUMPTION_FOUND")}</p>}
    </div>

  </React.Fragment>
  );
};
export default consumptionDetails;