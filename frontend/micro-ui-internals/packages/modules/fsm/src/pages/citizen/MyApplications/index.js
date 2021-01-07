import React from "react";
import { Header, Loader } from "@egovernments/digit-ui-react-components";
import MyApplication from "./MyApplication";
import { useTranslation } from "react-i18next";

export const MyApplications = () => {
  const { t } = useTranslation();

  const { isLoading, isError, error, data } = Digit.Hooks.fsm.useSearch("pb.amritsar");

  if (isLoading) {
    return <Loader />;
  }
  console.log("test------------>>", data);

  const { fsm: applicationsList } = data;
  console.log("applicationsList", applicationsList);

  return (
    <React.Fragment>
      <Header>{t("CS_MY_APPLICATIONS")}</Header>
      {applicationsList?.length > 0 &&
        applicationsList.map((application, index) => (
          <div key={index}>
            <MyApplication application={application} />
          </div>
        ))}
    </React.Fragment>
  );
};
