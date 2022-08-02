import { BreadCrumb, PrivateRoute } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link, Switch, useLocation } from "react-router-dom";
import { CommonPTLinks } from "../../Module";
import ViewProperty from "../pageComponents/ViewProperty";
import NewApplication from "./NewApplication";
import Search from "./Search";

const EmployeeApp = ({ path, url, userType }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const mobileView = innerWidth <= 640;

  const breadcrumbObj = {
    ["/digit-ui/employee/pt/inbox"]: "ES_TITLE_INBOX",
    ["/digit-ui/employee/pt/new-application"]: "ES_TITLE_NEW_PROPERTY_APPLICATION",
    ["/digit-ui/employee/pt/search"]: "ES_COMMON_SEARCH",
    ["/digit-ui/employee/pt/application-search"]: "ES_COMMON_APPLICATION_SEARCH",
  };

  const getBreadCrumb = () => {
    if (location.pathname.includes("/commonpt/search")) return t("SEARCH_PROPERTY");
    else if (location.pathname.includes("/view-property")) return t("PT_PROPERTY_INFORMATION");
    else return t("PT_NEW_PROPERTY");
  };
  const search = useLocation().search;

  const redirectUrl = new URLSearchParams(search).get("redirectToUrl");
  const fromScreen = new URLSearchParams(search).get("from")||"";

  const crumbs = [
    {
      path: "/digit-ui/employee",
      content: t("ES_COMMON_HOME"),
      show: true,
    },
    {
      path: { pathname: redirectUrl, state: { ...location.state } },
      content:redirectUrl?( redirectUrl?.includes("employee/tl/new-application")
        ? t("ES_TITLE_NEW_TRADE_LICESE_APPLICATION")
        : t("WF_EMPLOYEE_NEWTL_RENEWAL_SUBMIT_BUTTON")):(fromScreen&&t(fromScreen))||"NONE",
      show: (redirectUrl || fromScreen) &&true,
      isBack:fromScreen&& true
    },
    {
      path: "/digit-ui/employee/dss/drilldown",
      content: getBreadCrumb(),
      show: true,
    },
  ];

  const locationCheck = window.location.href.includes("/employee/commonpt/new-application")

  return (
    <Switch>
      <React.Fragment>
        <div className="ground-container">
          {/* <p className="breadcrumb" style={{ marginLeft: mobileView ? "2vw" : "12px" }}>
            <Link to="/digit-ui/employee" style={{ cursor: "pointer", color: "#666" }}>
              {t("ES_COMMON_HOME")}
            </Link>{" "}
            / <span>{getBreadCrumb()}</span>
          </p> */}
          <div style={locationCheck ? {marginLeft:"12px"} : {}}>
          <BreadCrumb crumbs={crumbs} />
          </div>
          <PrivateRoute exact path={`${path}/`} component={() => <CommonPTLinks matchPath={path} userType={userType} />} />
          <PrivateRoute path={`${path}/new-application`} component={() => <NewApplication parentUrl={url} />} />
          <PrivateRoute path={`${path}/search`} component={() => <Search />} />
          <PrivateRoute path={`${path}/view-property`} component={() => <ViewProperty />} />
        </div>
      </React.Fragment>
    </Switch>
  );
};

export default EmployeeApp;
