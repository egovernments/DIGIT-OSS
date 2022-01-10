import { Card, CardSubHeader, Header, LinkButton, Loader, Row, StatusTable } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
//import PropertyDocument from "../../pageComponents/PropertyDocument";
import WSWFApplicationTimeline from "../../pageComponents/WSWFApplicationTimeline";

const WSApplicationDetails = () => {
  const { t } = useTranslation();
  //const application = data?.Properties[0];
  return (
    <React.Fragment>
      <Header>{t("Application Details")}</Header>
      <div className='hide-seperator'>
        <Card>
          <StatusTable>
            <Row label={t("Application number")} text={"WS - 767 - 23 - 213433"} textStyle={{ whiteSpace: "pre" }} />
            <Row label={t("Service Name")} text={"Sewerage"} textStyle={{ whiteSpace: "pre" }} />
            <Row label={t("Amount Due")} text={"₹ 15000.00"} textStyle={{ whiteSpace: "pre" }} />
          </StatusTable>
        </Card>
        <Card>
          <CardSubHeader>{t("Fee Details")}</CardSubHeader>
          <StatusTable>
            <Row label={t("One time Fee")} text={"₹ 16500.00"} textStyle={{textAlign: "right" }} />
            <Row label={t("Security Charge")} text={"₹ 500.00"} textStyle={{textAlign: "right" }} />
            <Row label={t("Meter Charge")} text={"₹ 2000.00"} textStyle={{textAlign: "right" }} />
            <Row label={t("Tax and Cess")} text={" ₹ 200.00"} textStyle={{textAlign: "right" }} />
            <Row label={t("Total Amount Due")} text={"₹ 15000.00"} textStyle={{textAlign: "right" }} />
            <Row label={t("Status")} text={"Unpaid"} textStyle={{textAlign: "right" }} />
          </StatusTable>
        </Card>
        <Card>
          <CardSubHeader>{t("Property Details")}</CardSubHeader>
          <StatusTable>
            <Row label={t("Property ID")} text={"PG-PT-2021-09-29-006024"} textStyle={{ whiteSpace: "pre" }} />
            <Row label={t("Owner Name")} text={"N* P*****"} textStyle={{ whiteSpace: "pre" }} />
            <Row label={t("Property Address")} text={"****, ** ******, Ajit Nagar, Area 1, Amritsar"} textStyle={{ whiteSpace: "pre" }} />
            <Row label={t("Tax and Cess")} text={" ₹ 200.00"} textStyle={{ whiteSpace: "pre" }} />
            <Row label={t("Total Amount Due")} text={" ₹ 15000.00"} textStyle={{ whiteSpace: "pre" }} />
            <Row label={t("Status")} text={"Unpaid"} textStyle={{ whiteSpace: "pre" }} />
          </StatusTable>
        </Card>
        <Card>
          <CardSubHeader>{t("Connection Holder Details")}</CardSubHeader>
          <StatusTable>
            <Row label={t("Mobile Number")} text={"7********78"} textStyle={{ whiteSpace: "pre" }} />
            <Row label={t("Name")} text={"Sheetal"} textStyle={{ whiteSpace: "pre" }} />
            <Row label={t("Gender")} text={"Female"} textStyle={{ whiteSpace: "pre" }} />
            <Row label={t("Fathers / Husband’s name")} text={"XXXX"} textStyle={{ whiteSpace: "pre" }} />
            <Row label={t("Relationship")} text={"Father"} textStyle={{ whiteSpace: "pre" }} />
            <Row label={t("Correspondance Address")} text={"A16, Ajit Nagar, City B"} textStyle={{ whiteSpace: "pre" }} />
            <Row label={t("Special Applicant category")} text={"NA"} textStyle={{ whiteSpace: "pre" }} />
          </StatusTable>
        </Card>
        <Card>
          <CardSubHeader>{t("Connection Details")}</CardSubHeader>
          <StatusTable>
            <Row label={t("Number of Water Closets")} text={"2"} textStyle={{ whiteSpace: "pre" }} />
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
