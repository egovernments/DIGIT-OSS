import {
  BreadCrumb,
  ShippingTruck,
  EmployeeModuleCard,
  PrivateRoute,
  BackButton,
  AddNewIcon,
  ViewReportIcon,
  InboxIcon,
  ULBHomeCard,
} from "@egovernments/digit-ui-react-components";
import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Switch, useLocation } from "react-router-dom";
import FstpAddVehicle from "./FstpAddVehicle";
import FstpOperations from "./FstpOperations";
import FstpServiceRequest from "./FstpServiceRequest";

export const FsmBreadCrumb = ({ location }) => {
  const { t } = useTranslation();
  const DSO = Digit.UserService.hasAccess(["FSM_DSO"]);
  const FSTPO = Digit.UserService.hasAccess(["FSM_EMP_FSTPO"]);
  const isApplicationDetails = location?.pathname?.includes("application-details");
  const isVehicleLog = location?.pathname?.includes("fstp-operator-details");
  const isInbox = location?.pathname?.includes("inbox");
  const isFsm = location?.pathname?.includes("fsm");
  const isSearch = location?.pathname?.includes("search");
  const isNewApplication = location?.pathname?.includes("new-application");
  const [search, setSearch] = useState(false);
  const [id, setId] = useState(false);

  useEffect(() => {
    if (!search) {
      setSearch(isSearch);
    } else if (isInbox && search) {
      setSearch(false);
    }
    if (location?.pathname) {
      let path = location?.pathname.split("/");
      let id = path[path.length - 1];
      setId(id);
    }
  }, [location]);

  const crumbs = [
    {
      path: DSO ? "/digit-ui/citizen/fsm/dso-dashboard" : "/digit-ui/employee",
      content: t("ES_COMMON_HOME"),
      show: isFsm,
    },
    {
      path: FSTPO ? "/digit-ui/employee/fsm/fstp-inbox" : "/digit-ui/employee/fsm/inbox",
      content: isInbox || isApplicationDetails || search || isVehicleLog ? t("ES_TITLE_INBOX") : "FSM",
      show: isFsm,
    },
    {
      path: "/digit-ui/employee/fsm/search",
      content: t("ES_TITILE_SEARCH_APPLICATION"),
      show: search,
    },
    { content: t("ES_TITLE_APPLICATION_DETAILS"), show: isApplicationDetails },
    { content: t("ES_TITLE_VEHICLE_LOG"), show: isVehicleLog },
  ];

  return <BreadCrumb crumbs={crumbs} />;
};

const EmployeeApp = ({ path, url, userType }) => {
  const { t } = useTranslation();
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
  const FSTPO = Digit.UserService.hasAccess(["FSM_EMP_FSTPO"]);
  const BreadCrumbComp = Digit.ComponentRegistryService.getComponent("FsmBreadCrumb");

  return (
    <Switch>
      <React.Fragment>
        <div className="ground-container">
          {FSTPO ? (
            <BackButton
              isCommonPTPropertyScreen={location.pathname.includes("new") ? true : false}
              getBackPageNumber={location.pathname.includes("new") ? () => -2 : null}
            >
              {t("CS_COMMON_BACK")}
            </BackButton>
          ) : (
            <BreadCrumbComp location={location} />
          )}
          <PrivateRoute exact path={`${path}/`} component={() => <FSMLinks matchPath={path} userType={userType} />} />
          <PrivateRoute path={`${path}/inbox`} component={() => <Inbox parentRoute={path} isInbox={true} />} />
          <PrivateRoute path={`${path}/fstp-inbox`} component={() => <FstpInbox parentRoute={path} />} />
          <PrivateRoute path={`${path}/new-application`} component={() => <NewApplication parentUrl={url} />} />
          <PrivateRoute path={`${path}/modify-application/:id`} component={() => <EditApplication />} />
          <PrivateRoute
            path={`${path}/application-details/:id`}
            component={() => <EmployeeApplicationDetails parentRoute={path} userType="EMPLOYEE" />}
          />
          <PrivateRoute path={`${path}/fstp-operator-details/:id`} component={FstpOperatorDetails} />
          <PrivateRoute path={`${path}/response`} component={(props) => <Response {...props} parentRoute={path} />} />
          <PrivateRoute path={`${path}/application-audit/:id`} component={() => <ApplicationAudit parentRoute={path} />} />
          <PrivateRoute path={`${path}/search`} component={() => <Inbox parentRoute={path} isSearch={true} />} />
          <PrivateRoute path={`${path}/rate-view/:id`} component={() => <RateView parentRoute={path} />} />
          <PrivateRoute path={`${path}/mark-for-disposal`} component={() => <div />} />
          <PrivateRoute exact path={`${path}/fstp-operations`} component={() => <FstpOperations />} />
          <PrivateRoute exact path={`${path}/fstp-add-vehicle`} component={() => <FstpAddVehicle />} />
          <PrivateRoute exact path={`${path}/fstp-fsm-request/:id`} component={() => <FstpServiceRequest />} />
          <PrivateRoute exact path={`${path}/home`} component={() => <ULBHomeCard module={module} />} />
          <PrivateRoute exact path={`${path}/fstp/new-vehicle-entry`} component={FstpOperatorDetails} />
          <PrivateRoute exact path={`${path}/fstp/new-vehicle-entry/:id`} component={FstpOperatorDetails} />
        </div>
      </React.Fragment>
    </Switch>
  );
};

export default EmployeeApp;
