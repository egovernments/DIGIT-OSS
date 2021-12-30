import { PrivateRoute } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link, Switch, useLocation } from "react-router-dom";
import { CommonPTLinks } from "../../Module";
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
    if (breadcrumbObj[location.pathname]) return t(breadcrumbObj[location.pathname]);
    else if (location.pathname.includes("/digit-ui/employee/pt/application-details/")) return t("PT_APPLICATION_TITLE");
    else if (location.pathname.includes("/digit-ui/employee/pt/property-details/")) return t("PT_PROPERTY_INFORMATION");
    else if (location.pathname.includes("/digit-ui/employee/pt/assessment-details/")) return t("PT_ASSESS_PROPERTY");
    else if (location.pathname.includes("digit-ui/employee/pt/property-mutate-docs-required")) return t("PT_REQIURED_DOC_TRANSFER_OWNERSHIP");
    else if (location.pathname.includes("/digit-ui/employee/pt/property-mutate/")) return t("ES_TITLE_MUTATE_PROPERTY");
    else if (location.pathname.includes("/digit-ui/employee/pt/modify-application/")) return t("PT_UPDATE_PROPERTY");
  };

  return (
    <Switch>
      <React.Fragment>
        <div className="ground-container">
          <p className="breadcrumb" style={{ marginLeft: mobileView ? "2vw" : "revert" }}>
            <Link to="/digit-ui/employee" style={{ cursor: "pointer", color: "#666" }}>
              {t("ES_COMMON_HOME")}
            </Link>{" "}
            / <span>{getBreadCrumb()}</span>
          </p>
          <PrivateRoute exact path={`${path}/`} component={() => <CommonPTLinks matchPath={path} userType={userType} />} />
          <PrivateRoute path={`${path}/new-application`} component={() => <NewApplication parentUrl={url} />} />
          <PrivateRoute path={`${path}/search`} component={() => <Search />} />
        </div>
      </React.Fragment>
    </Switch>
  );
};

export default EmployeeApp;
