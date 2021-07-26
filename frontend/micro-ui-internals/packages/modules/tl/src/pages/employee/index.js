import React from "react";
import { Switch, useLocation, Link } from "react-router-dom";
import { PrivateRoute } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import Inbox from "./Inbox";
import NewApplication from "./NewApplication";
import Search from "./Search";
import Response from "../Response";
import ApplicationDetails from "./ApplicationDetails";
import ReNewApplication from "./ReNewApplication";

const EmployeeApp = ({ path, url, userType }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const mobileView = innerWidth <= 640;

  return (
    <Switch>
      <React.Fragment>
        <div className="ground-container">
          <p className="breadcrumb" style={{ marginLeft: mobileView ? "2vw" : "revert" }}>
            <Link to="/digit-ui/employee" style={{ cursor: "pointer", color: "#666" }}>
              {t("ES_COMMON_HOME")}
            </Link>{" "}
            / 
            {location.pathname === "/digit-ui/employee/tl/inbox" ? 
              <span>{location.pathname === "/digit-ui/employee/tl/inbox" ? t("ES_COMMON_INBOX") : ""}</span>
              : 
              <Link to="/digit-ui/employee/tl/inbox" style={{ cursor: "pointer", color: "#666" }}>
                {location.pathname.includes("/digit-ui/employee/tl/") ? t("ES_COMMON_INBOX") : ""}
              </Link>}
            <span>{location.pathname.includes("/digit-ui/employee/tl/search/application") ? `/ ${t("ES_COMMON_SEARCH_APPLICATION") }`  : null}</span>
            <span>{location.pathname.includes("/digit-ui/employee/tl/search/license") ? `/ ${t("TL_SEARCH_TRADE_HEADER") }`  : null}</span>
            <span>{location.pathname.includes("/digit-ui/employee/tl/application-details") ? `/ ${t("TL_DETAILS_HEADER_LABEL") }`  : null}</span>
            <span>{location.pathname.includes("/digit-ui/employee/tl/new-application") ? `/ ${t("TL_HOME_SEARCH_RESULTS_NEW_APP_BUTTON") }`  : null}</span>
            <span>{location.pathname.includes("/digit-ui/employee/tl/renew-application-details") ? `/ ${t("ES_TITLE_RE_NEW_TRADE_LICESE_APPLICATION") }`  : null}</span>
            <span>{location.pathname.includes("/digit-ui/employee/tl/edit-application-details") ? `/ ${t("ES_TITLE_RE_NEW_TRADE_LICESE_APPLICATION") }`  : null}</span>
          </p>
          <PrivateRoute
            path={`${path}/inbox`}
            component={() => (
              <Inbox parentRoute={path} businessService="TL" filterComponent="TL_INBOX_FILTER" initialStates={{}} isInbox={true} />
            )}
          />
          <PrivateRoute path={`${path}/new-application`} component={() => <NewApplication parentUrl={url} />} />
          <PrivateRoute path={`${path}/application-details/:id`} component={() => <ApplicationDetails parentRoute={path} />} />
          <PrivateRoute path={`${path}/renew-application-details/:id`} component={(props) => <ReNewApplication {...props} parentRoute={path} />} />
          <PrivateRoute path={`${path}/edit-application-details/:id`} component={(props) => <ReNewApplication {...props} header={t("TL_ACTION_RESUBMIT")} parentRoute={path} />} />
          <PrivateRoute path={`${path}/response`} component={(props) => <Response {...props} parentRoute={path} />} />
          <PrivateRoute path={`${path}/search/:variant`} component={(props) => <Search {...props} parentRoute={path} />} />
          
        </div>
      </React.Fragment>
    </Switch>
  );
};

export default EmployeeApp;
