import { Card, CardSubHeader, Header, LinkButton, Loader, Row, StatusTable } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
//import PropertyDocument from "../../pageComponents/PropertyDocument";
import WSWFApplicationTimeline from "../../pageComponents/WSWFApplicationTimeline";

const WSApplicationDetails = () => {
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const user = Digit.UserService.getUser();
  //const { acknowledgementIds } = useParams();

  let filter1 = !isNaN(parseInt(filter))
  ? { tenantId: tenantId, mobileNumber: user?.info?.mobileNumber,  }
  : { tenantId: tenantId, mobileNumber: user?.info?.mobileNumber };

const { isLoading, isError, error, data } = Digit.Hooks.ws.useMyApplicationSearch({ filters: filter1 }, { filters: filter1 });
if (isLoading) {
  return <Loader />;
}

const { WaterConnection: applicationsList } = data || {};
console.log(applicationsList);

  //const application = data?.Properties[0];
  return (
    <React.Fragment>
      <Header>{t("Application Details")}</Header>
      <div className='hide-seperator'>
        <Card>
          <StatusTable>
            <Row label={t("WS_MYCONNECTIONS_APPLICATION_NO")} text={data.applicationNo} textStyle={{ whiteSpace: "pre" }} />
            <Row label={t("WS_MYCONNECTIONS_SERVICE")} text={data.applicationType} textStyle={{ whiteSpace: "pre" }} />
            <Row label={t("Amount Due")} text={"₹ 15000.00"} textStyle={{ whiteSpace: "pre" }} />
          </StatusTable>
        </Card>
        <Card>
          <CardSubHeader>{t("Fee Details")}</CardSubHeader>
          <StatusTable>
            <Row label={t("One time Fee")} text={"₹ 16500.00"} textStyle={{textAlign: "right" }} />
            <Row label={t("Security Charge")} text={"₹ 500.00"} textStyle={{textAlign: "right" }} />
            <Row label={t("Meter Charge")} text={"₹ 2000.00"} textStyle={{textAlign: "right" }} />
            <Row label={t("Tax")} text={" ₹ 200.00"} textStyle={{textAlign: "right" }} />
            <Row label={t("WS_COMMON_TOTAL_AMT")} text={"₹ 15000.00"} textStyle={{textAlign: "right" }} />
            <Row label={t("Status")} text={"Unpaid"} textStyle={{textAlign: "right" }} />
          </StatusTable>
        </Card>
        <Card>
          <CardSubHeader>{t("Property Details")}</CardSubHeader>
          <StatusTable>
            <Row label={t("WS_PROPERTY_ID_LABEL")} text={data.propertyId} textStyle={{ whiteSpace: "pre" }} />
            <Row label={t("WS_OWN_DETAIL_OWN_NAME_LABEL")} text={data.name} textStyle={{ whiteSpace: "pre" }} />
            <Row label={t("WS_OWN_DETAIL_CROSADD")} text={data.correspondenceAddress} textStyle={{ whiteSpace: "pre" }} />
            <Row label={t("Tax")} text={" ₹ 200.00"} textStyle={{ whiteSpace: "pre" }} />
            <Row label={t("WS_COMMON_TOTAL_AMT")} text={" ₹ 15000.00"} textStyle={{ whiteSpace: "pre" }} />
            <Row label={t("Status")} text={"Unpaid"} textStyle={{ whiteSpace: "pre" }} />
          </StatusTable>
        </Card>
        <Card>
          <CardSubHeader>{t("Connection Holder Details")}</CardSubHeader>
          <StatusTable>
            <Row label={t("WS_OWN_DETAIL_MOBILE_NO_LABEL")} text={data.mobileNumber} textStyle={{ whiteSpace: "pre" }} />
            <Row label={t("WS_OWN_DETAIL_OWN_NAME_LABEL")} text={data.name} textStyle={{ whiteSpace: "pre" }} />
            <Row label={t("WS_OWN_DETAIL_GENDER_LABEL")} text={data.gender} textStyle={{ whiteSpace: "pre" }} />
            <Row label={t("WS_OWN_DETAIL_FATHER_OR_HUSBAND_NAME")} text={data.fatherOrHusbandName} textStyle={{ whiteSpace: "pre" }} />
            <Row label={t("WS_OWN_DETAIL_RELATION_LABEL")} text={data.relationship} textStyle={{ whiteSpace: "pre" }} />
            <Row label={t("WS_OWN_DETAIL_CROSADD")} text={data.correspondenceAddress} textStyle={{ whiteSpace: "pre" }} />
            <Row label={t("WS_OWN_DETAIL_SPECIAL_APPLICANT_LABEL")} text={"NA"} textStyle={{ whiteSpace: "pre" }} />
          </StatusTable>
        </Card>
        <Card>
          <CardSubHeader>{t("Connection Details")}</CardSubHeader>
          <StatusTable>
            <Row label={t("WS_TASK_DETAILS_CONN_DETAIL_NO_OF_TAPS_PROPOSED")} text={"2"} textStyle={{ whiteSpace: "pre" }} />
            <Row label={t("Number of Toilets")} text={"2"} textStyle={{ whiteSpace: "pre" }} />
          </StatusTable>
        </Card>
        {/* <Card>
        <PropertyDocument property={application}></PropertyDocument>
        </Card> */}
        <Card>
        {/* <PTWFApplicationTimeline application={application} id={acknowledgementIds} /> */}
        <WSWFApplicationTimeline />
        <h1>Hello</h1>
        </Card>
      </div>
    </React.Fragment>
  );
};

export default WSApplicationDetails;
