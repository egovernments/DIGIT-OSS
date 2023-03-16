import { BackButton, PrivateRoute } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Redirect, Switch, useLocation } from "react-router-dom";

const CitizenApp = ({ path }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const NewApplicationCitizen = Digit.ComponentRegistryService.getComponent("FSMNewApplicationCitizen");
  const MyApplications = Digit.ComponentRegistryService.getComponent("FSMMyApplications");
  const EmployeeApplicationDetails = Digit.ComponentRegistryService.getComponent("FSMEmployeeApplicationDetails");
  const ApplicationDetails = Digit.ComponentRegistryService.getComponent("FSMCitizenApplicationDetails");
  const SelectRating = Digit.ComponentRegistryService.getComponent("FSMSelectRating");
  const RateView = Digit.ComponentRegistryService.getComponent("FSMRateView");
  const Response = Digit.ComponentRegistryService.getComponent("FSMResponse");
  const DsoDashboard = Digit.ComponentRegistryService.getComponent("FSMDsoDashboard");
  const Inbox = Digit.ComponentRegistryService.getComponent("FSMEmpInbox");

  return (
    <React.Fragment>
      <div className="fsm-citizen-wrapper">
        {location.pathname.includes("/response") || location.pathname.split("/").includes("check") ? null : <BackButton>{t("CS_COMMON_BACK")}</BackButton>}
        <Switch>
          <PrivateRoute
            path={`${path}/inbox`}
            component={() =>
              Digit.UserService.hasAccess(["FSM_DSO"]) ? <Inbox parentRoute={path} isInbox={true} /> : <Redirect to="/digit-ui/citizen" />
            }
          />
          <PrivateRoute
            path={`${path}/search`}
            component={() =>
              Digit.UserService.hasAccess(["FSM_DSO"]) ? <Inbox parentRoute={path} isSearch={true} /> : <Redirect to="/digit-ui/citizen" />
            }
          />
          <PrivateRoute path={`${path}/new-application`} component={() => <NewApplicationCitizen parentRoute={path} />} />
          <PrivateRoute path={`${path}/my-applications`} component={MyApplications} />
          <PrivateRoute
            path={`${path}/dso-application-details/:id`}
            component={() => <EmployeeApplicationDetails parentRoute={path} userType="DSO" />}
          />
          <PrivateRoute path={`${path}/application-details/:id`} component={() => <ApplicationDetails parentRoute={path} />} />
          <PrivateRoute path={`${path}/rate/:id`} component={() => <SelectRating parentRoute={path} />} />
          <PrivateRoute path={`${path}/rate-view/:id`} component={() => <RateView parentRoute={path} />} />
          <PrivateRoute path={`${path}/response`} component={(props) => <Response parentRoute={path} {...props} />} />
          <PrivateRoute path={`${path}/dso-dashboard`} component={() => <DsoDashboard parentRoute={path} />} />
        </Switch>
      </div>
    </React.Fragment>
  );
};

export default CitizenApp;
