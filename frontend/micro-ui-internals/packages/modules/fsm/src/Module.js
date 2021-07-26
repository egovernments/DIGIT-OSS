import React, { useMemo, useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Switch, useRouteMatch, useLocation, Link, useHistory } from "react-router-dom";
import { BackButton, BreadCrumb, Header, Loader, PrivateRoute, CitizenHomeCard, DropIcon } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";

import NewApplicationCitizen from "./pages/citizen/NewApplication/index";
import SelectRating from "./pages/citizen/Rating/SelectRating";
import { MyApplications } from "./pages/citizen/MyApplications";
import ApplicationDetails from "./pages/citizen/ApplicationDetails";

import { NewApplication } from "./pages/employee/NewApplication";
import EmployeeApplicationDetails from "./pages/employee/ApplicationDetails";
import ApplicationAudit from "./pages/employee/ApplicationAudit";
import Response from "./pages/Response";
import EditApplication from "./pages/employee/EditApplication";
import Inbox from "./pages/employee/Inbox";
import FstpOperatorDetails from "./pages/employee/FstpOperatorDetails";
import DsoDashboard from "./pages/employee/DsoDashboard";

import FstpInbox from "./pages/employee/FstpInbox";

import SelectPropertySubtype from "./pageComponents/SelectPropertySubtype";
import SelectPropertyType from "./pageComponents/SelectPropertyType";
import SelectAddress from "./pageComponents/SelectAddress";
import SelectStreet from "./pageComponents/SelectStreet";
import SelectLandmark from "./pageComponents/SelectLandmark";
import SelectPincode from "./pageComponents/SelectPincode";
import SelectTankSize from "./pageComponents/SelectTankSize";
import SelectPitType from "./pageComponents/SelectPitType";
import SelectGeolocation from "./pageComponents/SelectGeolocation";
import SelectSlumName from "./pageComponents/SelectSlumName";
import CheckSlum from "./pageComponents/CheckSlum";
import SelectChannel from "./pageComponents/SelectChannel";
import SelectName from "./pageComponents/SelectName";
import SelectTripData from "./pageComponents/SelectTripData";
import FSMCard from "./components/FsmCard";
import { Redirect } from "react-router-dom";
import RateView from "./pages/citizen/Rating/RateView";

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
          <PrivateRoute path={`${path}/application-details/:id`} component={() => <EmployeeApplicationDetails parentRoute={path} />} />
          <PrivateRoute path={`${path}/fstp-operator-details/:id`} component={FstpOperatorDetails} />
          <PrivateRoute path={`${path}/response`} component={(props) => <Response {...props} parentRoute={path} />} />
          <PrivateRoute path={`${path}/application-audit/:id`} component={() => <ApplicationAudit parentRoute={path} />} />
          <PrivateRoute path={`${path}/search`} component={() => <Inbox parentRoute={path} isSearch={true} />} />
          <PrivateRoute path={`${path}/rate-view/:id`} component={() => <RateView parentRoute={path} />} />
          <PrivateRoute path={`${path}/mark-for-disposal`} component={() => <MarkForDisposal parentRoute={path} />} />
        </div>
      </React.Fragment>
    </Switch>
  );
};

const CitizenApp = ({ path }) => {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <React.Fragment>
      {!location.pathname.includes("/new-application/response") && <BackButton>{t("CS_COMMON_BACK")}</BackButton>}
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
        <PrivateRoute path={`${path}/dso-application-details/:id`} component={() => <EmployeeApplicationDetails parentRoute={path} />} />
        <PrivateRoute path={`${path}/application-details/:id`} component={() => <ApplicationDetails parentRoute={path} />} />
        <PrivateRoute path={`${path}/rate/:id`} component={() => <SelectRating parentRoute={path} />} />
        <PrivateRoute path={`${path}/rate-view/:id`} component={() => <RateView parentRoute={path} />} />
        <PrivateRoute path={`${path}/response`} component={(props) => <Response parentRoute={path} {...props} />} />
        <PrivateRoute path={`${path}/dso-dashboard`} component={() => <DsoDashboard parentRoute={path} />} />
      </Switch>
    </React.Fragment>
  );
};

const FSMModule = ({ stateCode, userType, tenants }) => {
  const moduleCode = "FSM";
  const { path, url } = useRouteMatch();
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({ stateCode, moduleCode, language });

  if (isLoading) {
    return <Loader />;
  }

  console.log("fsm", userType, path, store);
  Digit.SessionStorage.set("FSM_TENANTS", tenants);

  if (userType === "citizen") {
    return <CitizenApp path={path} />;
  } else {
    return <EmployeeApp path={path} url={url} userType={userType} />;
  }
};

const FSMLinks = ({ matchPath, userType }) => {
  const { t } = useTranslation();
  const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage("FSM_CITIZEN_FILE_PROPERTY", {});

  useEffect(() => {
    clearParams();
  }, []);

  const roleBasedLoginRoutes = [
    {
      role: "FSM_DSO",
      from: "/digit-ui/citizen/fsm/dso-dashboard",
      dashoardLink: "CS_LINK_DSO_DASHBOARD",
      loginLink: "CS_LINK_LOGIN_DSO",
    },
  ];

  if (userType === "citizen") {
    const links = [
      {
        link: `${matchPath}/new-application`,
        i18nKey: t("CS_HOME_APPLY_FOR_DESLUDGING"),
      },
      {
        link: `${matchPath}/my-applications`,
        i18nKey: t("CS_HOME_MY_APPLICATIONS"),
      },
    ];

    roleBasedLoginRoutes.map(({ role, from, loginLink, dashoardLink }) => {
      if (Digit.UserService.hasAccess(role))
        links.push({
          link: from,
          i18nKey: t(dashoardLink),
        });
      else
        links.push({
          link: `/digit-ui/citizen/login`,
          state: { role: "FSM_DSO", from },
          i18nKey: t(loginLink),
        });
    });

    return <CitizenHomeCard header={t("CS_HOME_FSM_SERVICES")} links={links} Icon={DropIcon} />;
  } else {
    return (
      <div className="employee-app-container">
        <div className="ground-container">
          <div className="employeeCard">
            <div className="complaint-links-container">
              <div className="header">
                <span className="logo">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                    <path d="M0 0h24v24H0z" fill="none"></path>
                    <path
                      d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z"
                      fill="white"
                    ></path>
                  </svg>
                </span>
                <span className="text">{t("ES_TITLE_FSM")}</span>
              </div>
              <div className="body">
                <span className="link">
                  <Link to={`${matchPath}/inbox`}>{t("ES_TITLE_INBOX")}</Link>
                </span>
                <span className="link">
                  <Link to={`${matchPath}/new-application/`}>{t("ES_TITLE_NEW_DESULDGING_APPLICATION")}</Link>
                </span>
                {/* <span className="link">
                  <Link to={`${matchPath}/application-audit/`}>{t("ES_TITLE_APPLICATION_AUDIT")}</Link>
                </span> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

const componentsToRegister = {
  SelectPropertySubtype,
  SelectPropertyType,
  SelectAddress,
  SelectStreet,
  SelectLandmark,
  SelectPincode,
  SelectTankSize,
  SelectPitType,
  SelectGeolocation,
  SelectSlumName,
  CheckSlum,
  FSMCard,
  FSMModule,
  FSMLinks,
  SelectChannel,
  SelectName,
  SelectTripData,
};

export const initFSMComponents = () => {
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
