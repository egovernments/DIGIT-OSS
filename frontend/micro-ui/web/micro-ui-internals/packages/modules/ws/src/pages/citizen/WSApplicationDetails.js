import { Card, CardSubHeader, Header, LinkButton, Loader, Row, StatusTable } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import * as func from "./Utils/getQueryParams";
const WSApplicationDetails = () => {
  const { t } = useTranslation();
  const { applicationNumber } = useParams();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const user = Digit.UserService.getUser();

  let filters = func.getQueryStringParams(location.search);
  const { isLoading, isError, error, data } = Digit.Hooks.ws.useWnsMyApplication({ filters: filters }, { filters: filters });
  if (isLoading) {
    return <Loader />;
  }

  const { WaterConnection: applicationsList } = data || {};
  const application = applicationsList[0];

  return (
    <React.Fragment>
      <Header>{t("Application Details")}</Header>
      <div className="hide-seperator">
        <Card>
          <StatusTable>
            <Row label={t("WS_MYCONNECTIONS_APPLICATION_NO")} text={application?.applicationNo} textStyle={{ whiteSpace: "pre" }} />
            <Row label={t("WS_MYCONNECTIONS_SERVICE")} text={application?.applicationType} textStyle={{ whiteSpace: "pre" }} />
            <Row label={t("Amount Due")} text={"₹ 15000.00"} textStyle={{ whiteSpace: "pre" }} />
          </StatusTable>
        </Card>
        <Card>
          <CardSubHeader>{t("Fee Details")}</CardSubHeader>
          <StatusTable>
            <Row label={t("Tax")} text={" ₹ 200.00"} textStyle={{ textAlign: "right" }} />
            <Row label={t("WS_COMMON_TOTAL_AMT")} text={"₹ 15000.00"} textStyle={{ textAlign: "right" }} />
            <Row label={t("Status")} text={application?.status} textStyle={{ textAlign: "right" }} />
          </StatusTable>
        </Card>
        <Card>
          <CardSubHeader>{t("Property Details")}</CardSubHeader>
          <StatusTable>
            <Row label={t("WS_PROPERTY_ID_LABEL")} text={application?.propertyId} textStyle={{ whiteSpace: "pre" }} />
            <Row label={t("WS_OWN_DETAIL_OWN_NAME_LABEL")} text={application?.connectionHolders[0].name} textStyle={{ whiteSpace: "pre" }} />
            <Row label={"Property Address"} text={application?.connectionHolders[0].permanentAddress} textStyle={{ whiteSpace: "pre" }} />
          </StatusTable>
        </Card>
        <Card>
          <CardSubHeader>{t("Connection Holder Details")}</CardSubHeader>
          <StatusTable>
            <Row label={t("WS_OWN_DETAIL_MOBILE_NO_LABEL")} text={application?.connectionHolders[0].mobileNumber} textStyle={{ whiteSpace: "pre" }} />
            <Row label={t("WS_OWN_DETAIL_OWN_NAME_LABEL")} text={application?.connectionHolders[0].name} textStyle={{ whiteSpace: "pre" }} />
            <Row label={t("WS_OWN_DETAIL_GENDER_LABEL")} text={application?.connectionHolders[0].gender} textStyle={{ whiteSpace: "pre" }} />
            <Row
              label={t("WS_OWN_DETAIL_FATHER_OR_HUSBAND_NAME")}
              text={application?.connectionHolders[0].fatherOrHusbandName}
              textStyle={{ whiteSpace: "pre" }}
            />
            <Row label={t("WS_OWN_DETAIL_RELATION_LABEL")} text={application?.connectionHolders[0].relationship} textStyle={{ whiteSpace: "pre" }} />
            <Row
              label={t("WS_OWN_DETAIL_CROSADD")}
              text={application?.connectionHolders[0].correspondenceAddress}
              textStyle={{ whiteSpace: "pre" }}
            />
            <Row label={t("WS_OWN_DETAIL_SPECIAL_APPLICANT_LABEL")} text={application?.documents} textStyle={{ whiteSpace: "pre" }} />
          </StatusTable>
        </Card>
        <Card>
          <CardSubHeader>{t("Connection Details")}</CardSubHeader>
          <StatusTable>
            <Row label={t("WS_TASK_DETAILS_CONN_DETAIL_NO_OF_TAPS_PROPOSED")} text={application?.noOfTaps} textStyle={{ whiteSpace: "pre" }} />
            <Row label={t("Number of Toilets")} text={"2"} textStyle={{ whiteSpace: "pre" }} />
          </StatusTable>
        </Card>
      </div>
    </React.Fragment>
  );
};

export default WSApplicationDetails;
