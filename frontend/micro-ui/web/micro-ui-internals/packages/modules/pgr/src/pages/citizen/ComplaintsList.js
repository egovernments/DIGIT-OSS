import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router-dom";

import { Card, Header, Loader } from "@egovernments/digit-ui-react-components";
import { LOCALE } from "../../constants/Localization";
import Complaint from "../../components/Complaint";

export const ComplaintsList = (props) => {
  const User = Digit.UserService.getUser();
  const mobileNumber = User.mobileNumber || User?.info?.mobileNumber || User?.info?.userInfo?.mobileNumber;
  const tenantId = Digit.SessionStorage.get("CITIZEN.COMMON.HOME.CITY")?.code || Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const { path, url } = useRouteMatch();
  let { isLoading, error, data, revalidate } = Digit.Hooks.pgr.useComplaintsListByMobile(tenantId, mobileNumber);

  useEffect(() => {
    revalidate();
  }, []);

  if (isLoading) {
    return (
      <React.Fragment>
        <Header>{t(LOCALE.MY_COMPLAINTS)}</Header>
        <Loader />
      </React.Fragment>
    );
  }

  let complaints = data?.ServiceWrappers;
  let complaintsList;
  if (error) {
    complaintsList = (
      <Card>
        {t(LOCALE.ERROR_LOADING_RESULTS)
          .split("\\n")
          .map((text, index) => (
            <p key={index} style={{ textAlign: "center" }}>
              {text}
            </p>
          ))}
      </Card>
    );
  } else if (complaints.length === 0) {
    complaintsList = (
      <Card>
        {t(LOCALE.NO_COMPLAINTS)
          .split("\\n")
          .map((text, index) => (
            <p key={index} style={{ textAlign: "center" }}>
              {text}
            </p>
          ))}
      </Card>
    );
  } else {
    complaintsList = complaints.map(({ service }, index) => <Complaint key={index} data={service} path={path} />);
  }

  return (
    <React.Fragment>
      <div className="applications-list-container">
        <Header>{t(LOCALE.MY_COMPLAINTS)}</Header>
        {complaintsList}
      </div>
    </React.Fragment>
  );
};
