import React from "react";
import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router-dom";

import { Card, Header, Loader } from "@egovernments/digit-ui-react-components";
import { LOCALE } from "../../constants/Localization";
import Complaint from "../../components/Complaint";

export const ComplaintsList = (props) => {
  const User = Digit.UserService.getUser();
  const mobileNumber = User.mobileNumber || User?.info?.mobileNumber || User?.info?.userInfo?.mobileNumber;
  const { t } = useTranslation();
  const { path, url } = useRouteMatch();
  let { isLoading, error, data } = Digit.Hooks.pgr.useComplaintsListByMobile(mobileNumber);

  if (isLoading) {
    return (
      <React.Fragment>
        <Header>{t(LOCALE.MY_COMPLAINTS)}</Header>
        <Loader />
      </React.Fragment>
    );
  }

  console.log("complaints list", path, url);

  let complaints = data?.ServiceWrappers;
  let complaintsList;
  if (error) {
    complaintsList = (
      <Card>
        {t(LOCALE.ERROR_LOADING_RESULTS)
          .split("\\n")
          .map((text) => (
            <p style={{ textAlign: "center" }}>{text}</p>
          ))}
      </Card>
    );
  } else if (complaints.length === 0) {
    complaintsList = (
      <Card>
        {t(LOCALE.NO_COMPLAINTS)
          .split("\\n")
          .map((text) => (
            <p style={{ textAlign: "center" }}>{text}</p>
          ))}
      </Card>
    );
  } else {
    complaintsList = complaints.map(({ service }, index) => <Complaint key={index} data={service} path={path} />);
  }

  return (
    <React.Fragment>
      <Header>{t(LOCALE.MY_COMPLAINTS)}</Header>
      {complaintsList}
    </React.Fragment>
  );
};
