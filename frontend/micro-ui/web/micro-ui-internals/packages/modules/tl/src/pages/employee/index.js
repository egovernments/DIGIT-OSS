import React, { useState, useEffect } from "react";
import { Switch, useLocation, Link } from "react-router-dom";
import { PrivateRoute, BreadCrumb } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import Inbox from "./Inbox";
// import NewApplication from "./NewApplication";
// import Search from "./Search";
// import Response from "../Response";
import ApplicationDetails from "./ApplicationDetails";
//import ReNewApplication from "./ReNewApplication";

const TLBreadCrumb = ({ location }) => {
  const { t } = useTranslation();
  const isSearch = location?.pathname?.includes("search");
  const isInbox = location?.pathname?.includes("inbox");
  const isApplicationSearch = location?.pathname?.includes("search/application");
  const isLicenceSearch = location?.pathname?.includes("search/license");
  const isEditApplication = location?.pathname?.includes("edit-application-details");
  const isRenewalApplication = location?.pathname?.includes("renew-application-details");
  const isApplicationDetails = location?.pathname?.includes("tl/application-details");
  const isNewApplication = location?.pathname?.includes("tl/new-application");
  const isResponse = location?.pathname?.includes("tl/response");
  const isMobile = window.Digit.Utils.browser.isMobile();

  const [search, setSearch] = useState(false);

  const locationsForTLEmployee = window.location.href;
  const breadCrumbUrl = sessionStorage.getItem("breadCrumbUrl") || "";

  if (locationsForTLEmployee.includes("inbox")) {
    sessionStorage.setItem("breadCrumbUrl", "inbox");
  } else if (locationsForTLEmployee.includes("home")) {
    sessionStorage.setItem("breadCrumbUrl", "home");
  } else if (locationsForTLEmployee.includes("search/license")) {
    if (breadCrumbUrl == "home") sessionStorage.setItem("breadCrumbUrl", "home/license");
    else if (breadCrumbUrl == "inbox") sessionStorage.setItem("breadCrumbUrl", "inbox/license");
    else sessionStorage.setItem("breadCrumbUrl", breadCrumbUrl.includes("home/license") ? "home/license" : "inbox/license")
  } else if (locationsForTLEmployee.includes("search/application")) {
    if (breadCrumbUrl == "home") sessionStorage.setItem("breadCrumbUrl", "home/search");
    else if (breadCrumbUrl == "inbox") sessionStorage.setItem("breadCrumbUrl", "inbox/search");
    else sessionStorage.setItem("breadCrumbUrl", breadCrumbUrl.includes("home/search") ? "home/search" : "inbox/search")
  } else if (locationsForTLEmployee.includes("new-application")) {
    if (breadCrumbUrl == "home") sessionStorage.setItem("breadCrumbUrl", "home/newApp");
    else if (breadCrumbUrl == "inbox") sessionStorage.setItem("breadCrumbUrl", "inbox/newApp");
  } else if (locationsForTLEmployee.includes("application-details")) {
    if (breadCrumbUrl == "home/license") sessionStorage.setItem("breadCrumbUrl", "home/license/appDetails");
    else if (breadCrumbUrl == "inbox/license") sessionStorage.setItem("breadCrumbUrl", "inbox/license/appDetails");
    else if (breadCrumbUrl == "home/search") sessionStorage.setItem("breadCrumbUrl", "home/search/appDetails");
    else if (breadCrumbUrl == "inbox/search") sessionStorage.setItem("breadCrumbUrl", "inbox/search/appDetails");
    else if (breadCrumbUrl == "inbox") sessionStorage.setItem("breadCrumbUrl", "inbox/appDetails");
  } else if (locationsForTLEmployee.includes("renew-application-details")) {
    if (breadCrumbUrl == "inbox/appDetails") sessionStorage.setItem("breadCrumbUrl", "inbox/appDetails/renew");
    else if (breadCrumbUrl == "home/license/appDetails") sessionStorage.setItem("breadCrumbUrl", "home/license/appDetails/renew");
    else if (breadCrumbUrl == "inbox/license/appDetails") sessionStorage.setItem("breadCrumbUrl", "inbox/license/appDetails/renew");
    else if (breadCrumbUrl == "home/search/appDetails") sessionStorage.setItem("breadCrumbUrl", "home/search/appDetails/renew");
    else if (breadCrumbUrl == "inbox/search/appDetails") sessionStorage.setItem("breadCrumbUrl", "inbox/search/appDetails/renew");
  } else if (locationsForTLEmployee.includes("edit-application-details")) {
    if (breadCrumbUrl == "inbox/appDetails") sessionStorage.setItem("breadCrumbUrl", "inbox/appDetails/renew");
    else if (breadCrumbUrl == "home/license/appDetails") sessionStorage.setItem("breadCrumbUrl", "home/license/appDetails/edit");
    else if (breadCrumbUrl == "inbox/license/appDetails") sessionStorage.setItem("breadCrumbUrl", "inbox/license/appDetails/edit");
    else if (breadCrumbUrl == "home/search/appDetails") sessionStorage.setItem("breadCrumbUrl", "home/search/appDetails/edit");
    else if (breadCrumbUrl == "inbox/search/appDetails") sessionStorage.setItem("breadCrumbUrl", "inbox/search/appDetails/edit");
  } else if (locationsForTLEmployee.includes("response")) {
    sessionStorage.setItem("breadCrumbUrl", "")
  }

  useEffect(() => {
    if (!search) {
      setSearch(isSearch);
    } else if (isInbox && search) {
      setSearch(false);
    }
  }, [location]);

  const breadCrumbUrls = sessionStorage.getItem("breadCrumbUrl") || "";

  const crumbs = [
    {
      path: "/digit-ui/employee",
      content: t("ES_COMMON_HOME"),
      show: true
    },
    {
      path: "/digit-ui/employee/tl/inbox",
      content: t("ES_TITLE_INBOX"),
      show: breadCrumbUrls.includes("inbox") || isInbox
    },
    {
      path: "/digit-ui/employee/tl/search/application",
      content: t("ES_COMMON_SEARCH_APPLICATION"),
      show: isApplicationSearch ||
      breadCrumbUrls.includes("home/search") || 
      breadCrumbUrls.includes("inbox/search")
    },
    {
      path: "/digit-ui/employee/tl/search/license",
      content: t("TL_SEARCH_TRADE_HEADER"),
      show: isLicenceSearch || 
      breadCrumbUrls.includes("home/license") || 
      breadCrumbUrls.includes("inbox/license")
    },
    {
      path: sessionStorage.getItem("applicationNumber") ? `/digit-ui/employee/tl/application-details/${sessionStorage.getItem("applicationNumber")}` : "",
      content: t("TL_DETAILS_HEADER_LABEL"),
      show: isApplicationDetails ||
      breadCrumbUrls.includes("inbox/appDetails") || 
      breadCrumbUrls.includes("home/license/appDetails") || 
      breadCrumbUrls.includes("inbox/license/appDetails") || 
      breadCrumbUrls.includes("home/search/appDetails") || 
      breadCrumbUrls.includes("inbox/search/appDetails")
    },
    {
      path: "/digit-ui/employee/tl/new-application",
      content: t("TL_HOME_SEARCH_RESULTS_NEW_APP_BUTTON"),
      show: isNewApplication || 
      breadCrumbUrls.includes("home/newApp") || 
      breadCrumbUrls.includes("inbox/newApp")
    },
    {
      content: t("ES_TITLE_RENEW_TRADE_LICESE_APPLICATION"),
      show: isRenewalApplication  ||
      breadCrumbUrls.includes("inbox/appDetails/renew") || 
      breadCrumbUrls.includes("home/license/appDetails/renew") || 
      breadCrumbUrls.includes("inbox/license/appDetails/renew") || 
      breadCrumbUrls.includes("home/search/appDetails/renew") || 
      breadCrumbUrls.includes("inbox/search/appDetails/renew")
    },
    {
      content: t("ES_TITLE_RE_NEW_TRADE_LICESE_APPLICATION"),
      show: isEditApplication || 
      breadCrumbUrls.includes("inbox/appDetails/edit") || 
      breadCrumbUrls.includes("home/license/appDetails/edit") || 
      breadCrumbUrls.includes("inbox/license/appDetails/edit") || 
      breadCrumbUrls.includes("home/search/appDetails/edit") || 
      breadCrumbUrls.includes("inbox/search/appDetails/edit")
    },
    {
      path: "/digit-ui/employee/tl/inbox",
      content: t("ACTION_TEST_RESPONSE"),
      show: isResponse
    }
  ];

  return <BreadCrumb style={isMobile?{display:"flex"}:{}}  spanStyle={{maxWidth:"min-content"}} crumbs={crumbs} />;
};


const EmployeeApp = ({ path, url, userType }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const mobileView = innerWidth <= 640;

  const locationCheck = window.location.href.includes("employee/tl/new-application") || window.location.href.includes("employee/tl/response") || window.location.href.includes("employee/tl/edit-application-details") || window.location.href.includes("employee/tl/renew-application-details");

  const NewApplication = Digit?.ComponentRegistryService?.getComponent('TLNewApplication');
  const ReNewApplication = Digit?.ComponentRegistryService?.getComponent('TLReNewApplication');
  const Response = Digit?.ComponentRegistryService?.getComponent('TLResponse');
  const Search = Digit?.ComponentRegistryService?.getComponent('TLSearch');

  return (
    <Switch>
      <React.Fragment>
      <div className="ground-container" style={locationCheck ? {width: "100%", marginLeft: "0px"} : {marginLeft: "0px"}}>
          <div style={locationCheck ? {marginLeft: "15px"} : {}}>
            <TLBreadCrumb location={location} />
          </div>
          {/* <p className="breadcrumb" style={{ marginLeft: mobileView ? "2vw" : !locationCheck ? "revert": "15px" }}>
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
            <span>{location.pathname.includes("/digit-ui/employee/tl/renew-application-details") ? `/ ${t("ES_TITLE_RENEW_TRADE_LICESE_APPLICATION") }`  : null}</span>
            <span>{location.pathname.includes("/digit-ui/employee/tl/edit-application-details") ? `/ ${t("ES_TITLE_RE_NEW_TRADE_LICESE_APPLICATION") }`  : null}</span>
          </p> */}
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
