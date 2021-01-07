import React from "react";
import { Header } from "@egovernments/digit-ui-react-components";
import MyApplication from "./MyApplication";
import { useTranslation } from "react-i18next";

export const MyApplications = () => {
  const { t } = useTranslation();

  const applications = [
    {
      complaintNo: "FSM-56-353535",
      serviceCategory: "FSM",
      applicationType: "Desludging Request",
      status: "Pending for Payment",
    },
    {
      complaintNo: "FSM-56-353534",
      serviceCategory: "FSM",
      applicationType: "Desludging Request",
      status: "Pending for Payment",
    },
  ];

  return (
    <React.Fragment>
      <Header>{t("CS_TITLE_MY_APPLICATIONS")}</Header>
      {applications?.length > 0 &&
        applications.map((application, index) => (
          <div key={index}>
            <MyApplication application={application} />
          </div>
        ))}
    </React.Fragment>
  );
};
