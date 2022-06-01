import { BreadCrumb, PrivateRoute } from "@egovernments/digit-ui-react-components";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Switch, useLocation } from "react-router-dom";

const FsmBreadCrumb = ({ location }) => {
  const { t } = useTranslation();
  const DSO = Digit.UserService.hasAccess(["FSM_DSO"]);
  const isApplicationDetails = location?.pathname?.includes("application-details");
  const isInbox = location?.pathname?.includes("inbox");
  const isFsm = location?.pathname?.includes("fsm");
  const isSearch = location?.pathname?.includes("search");
  const [search, setSearch] = useState(false);

  useEffect(() => {
    if (!search) {
      setSearch(isSearch);
    } else if (isInbox && search) {
      setSearch(false);
    }
  }, [location]);

  const crumbs = [
    {
      path: DSO ? "/digit-ui/citizen/fsm/dso-dashboard" : "/digit-ui/employee",
      content: t("ES_COMMON_HOME"),
      show: isFsm,
    },
    {
      path: "/digit-ui/employee/fsm/inbox",
      content: isInbox || isApplicationDetails || search ? t("ES_TITLE_INBOX") : "FSM",
      show: isFsm,
    },
    {
      path: "/digit-ui/employee/fsm/search",
      content: t("ES_TITILE_SEARCH_APPLICATION"),
      show: search,
    },
    { content: t("ES_TITLE_APPLICATION_DETAILS"), show: isApplicationDetails },
  ];

  return <BreadCrumb crumbs={crumbs} />;
};

const EmployeeApp = ({ path, url, userType }) => {
  const location = useLocation();

  useEffect(() => {
    if (!location?.pathname?.includes("application-details")) {
      if (!location?.pathname?.includes("inbox")) {
        Digit.SessionStorage.del("fsm/inbox/searchParams");
      } else if (!location?.pathname?.includes("search")) {
        Digit.SessionStorage.del("fsm/search/searchParams");
      }
    }
  }, [location]);

  const Inbox = Digit.ComponentRegistryService.getComponent("FSMEmpInbox");
  const FstpInbox = Digit.ComponentRegistryService.getComponent("FSMFstpInbox");
  const NewApplication = Digit.ComponentRegistryService.getComponent("FSMNewApplicationEmp");
  const EditApplication = Digit.ComponentRegistryService.getComponent("FSMEditApplication");
  const EmployeeApplicationDetails = Digit.ComponentRegistryService.getComponent("FSMEmployeeApplicationDetails");
  const FstpOperatorDetails = Digit.ComponentRegistryService.getComponent("FSMFstpOperatorDetails");
  const Response = Digit.ComponentRegistryService.getComponent("FSMResponse");
  const ApplicationAudit = Digit.ComponentRegistryService.getComponent("FSMApplicationAudit");
  const RateView = Digit.ComponentRegistryService.getComponent("FSMRateView");
  const FSMLinks = Digit.ComponentRegistryService.getComponent("FSMLinks");

  return (
    <Switch>
      <React.Fragment>
        <div className="ground-container">
          <FsmBreadCrumb location={location} />
          <PrivateRoute exact path={`${path}/`} component={() => <FSMLinks matchPath={path} userType={userType} />} />
          <PrivateRoute path={`${path}/inbox`} component={() => <Inbox parentRoute={path} isInbox={true} />} />
          <PrivateRoute path={`${path}/fstp-inbox`} component={() => <FstpInbox parentRoute={path} />} />
          <PrivateRoute path={`${path}/new-application`} component={() => <NewApplication parentUrl={url} />} />
          <PrivateRoute path={`${path}/modify-application/:id`} component={() => <EditApplication />} />
          <PrivateRoute path={`${path}/application-details/:id`} component={() => <EmployeeApplicationDetails parentRoute={path} userType="EMPLOYEE" />} />
          <PrivateRoute path={`${path}/fstp-operator-details/:id`} component={FstpOperatorDetails} />
          <PrivateRoute path={`${path}/response`} component={(props) => <Response {...props} parentRoute={path} />} />
          <PrivateRoute path={`${path}/application-audit/:id`} component={() => <ApplicationAudit parentRoute={path} />} />
          <PrivateRoute path={`${path}/search`} component={() => <Inbox parentRoute={path} isSearch={true} />} />
          <PrivateRoute path={`${path}/rate-view/:id`} component={() => <RateView parentRoute={path} />} />
          <PrivateRoute path={`${path}/mark-for-disposal`} component={() => <div />} />
        </div>
      </React.Fragment>
    </Switch>
  );
};

export default EmployeeApp;
