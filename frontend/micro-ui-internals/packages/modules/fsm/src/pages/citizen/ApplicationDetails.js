import React from "react";
import { useTranslation } from "react-i18next";
import { Header, Card, KeyNote, SubmitBar, HomeLink, LinkButton } from "@egovernments/digit-ui-react-components";

const ApplicationDetails = () => {
  const { t } = useTranslation();
  const application = {
    complaintNo: "FSM-56-353535",
    serviceCategory: "FSM",
    applicationType: "Desludging Request",
    status: "Pending for Payment",
    applicationDate: "12/08/2020",
    propertyType: "Commercial / Petrol Pump",
    pitSize: "2m * 2m * 3m",
    noOfTrips: "1",
    desuldgingCharges: " ₹ 1500.00",
  };

  return (
    <React.Fragment>
      <Header>Application Details</Header>
      <Card>
        <KeyNote keyValue={t("Application No.")} note={application.complaintNo} />
        <KeyNote keyValue={t("Service Category")} note={application.serviceCategory} />
        <KeyNote keyValue={t("Application Type")} note={application.applicationType} />
        <KeyNote keyValue={t("Status")} note={application.status} />
        <KeyNote keyValue={t("Application Date")} note={application.applicationDate} />
        <KeyNote keyValue={t("Property Type")} note={application.propertyType} />
        <KeyNote keyValue={t("Pit Size")} note={application.pitSize} />
        <KeyNote keyValue={t("No. of Trips")} note={application.noOfTrips} />
        <KeyNote keyValue={t("Desludging Charges")} note={application.desuldgingCharges} />
        <SubmitBar label="Make Payment" />
      </Card>
    </React.Fragment>
  );
};

export default ApplicationDetails;
