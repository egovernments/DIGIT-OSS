import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useRouteMatch } from "react-router-dom";

import { Card, Header, Loader } from "@egovernments/digit-ui-react-components";
import { LOCALE } from "../../constants/Localization";
import Complaint from "../../components/Complaint";
import { useSelector } from "react-redux";

const useComplaintsList = () => {
  const User = Digit.SessionStorage.get("User");
  // TODO: move city to state
  const mobileNumber = User.mobileNumber || User?.info?.mobileNumber || User?.info?.userInfo?.mobileNumber;
  const { isLoading, error, data } = useQuery("complaintsList", () => Digit.PGRService.search("pb.amritsar", { mobileNumber }));
  return { isLoading, error, data };
};

export const ComplaintsList = (props) => {
  const { t } = useTranslation();
  const { path, url } = useRouteMatch();
  let { isLoading, error, data } = useComplaintsList();

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
        <p style={{ textAlign: "center" }}>{t(LOCALE.ERROR_LOADING_RESULTS)}</p>
      </Card>
    );
  } else if (complaints.length === 0) {
    complaintsList = (
      <Card>
        <p style={{ textAlign: "center" }}>{t(LOCALE.NO_COMPLAINTS)}</p>
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
