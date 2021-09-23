import React from "react";
import { PTLinks } from "../../Module";
import Inbox from "./Inbox";
import { Switch, useLocation, Link } from "react-router-dom";
import { PrivateRoute } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import NewApplication from "./NewApplication";
import EditApplication from "./EditApplication";
import ApplicationDetails from "./ApplicationDetails";
import PropertyDetails from "./PropertyDetails";
import AssessmentDetails from "./AssessmentDetails";
import Response from "../Response";
import TransferOwnership from "./PropertyMutation";
import DocsRequired from "./PropertyMutation/docsRequired";

const EmployeeApp = ({ path, url, userType }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const mobileView = innerWidth <= 640;

  const inboxInitialState = {
    searchParams: {
      uuid: { code: "ASSIGNED_TO_ALL", name: "ES_INBOX_ASSIGNED_TO_ALL" },
      services: ["PT.CREATE", "PT.MUTATION", "PT.UPDATE"],
      applicationStatus: [],
      locality: [],
    },
  };

  const combineTaxDueInSearchData = async (searchData, _break, _next) => {
    let returnData;
    const tenantId = Digit.ULBService.getCurrentTenantId();
    let businessService = ["PT"].join();
    let consumerCode = searchData.map((e) => e.propertyId).join();
    try {
      const res = await Digit.PaymentService.fetchBill(tenantId, { consumerCode, businessService });
      let obj = {};
      res.Bill.forEach((e) => {
        obj[e.consumerCode] = e.totalAmount;
      });
      returnData = searchData.map((e) => ({ ...e, due_tax: obj[e.propertyId] || 0 }));
    } catch (er) {
      const err = er?.response?.data;
      if (["EG_BS_BILL_NO_DEMANDS_FOUND", "EMPTY_DEMANDS"].includes(err?.Errors?.[0].code)) {
        returnData = searchData.map((e) => ({ ...e, due_tax: 0 }));
      }
    }
    return _next(returnData);
  };

  const searchMW = [{ combineTaxDueInSearchData }];

  const breadcrumbObj = {
    ["/digit-ui/employee/pt/inbox"]: "ES_TITLE_INBOX",
    ["/digit-ui/employee/pt/new-application"]: "ES_TITLE_NEW_PROPERTY_APPLICATION",
    ["/digit-ui/employee/pt/search"]: "ES_COMMON_SEARCH",
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
          <PrivateRoute exact path={`${path}/`} component={() => <PTLinks matchPath={path} userType={userType} />} />
          <PrivateRoute
            path={`${path}/inbox`}
            component={() => (
              <Inbox
                useNewInboxAPI={true}
                parentRoute={path}
                businessService="PT"
                filterComponent="PT_INBOX_FILTER"
                initialStates={inboxInitialState}
                isInbox={true}
              />
            )}
          />
          <PrivateRoute path={`${path}/new-application`} component={() => <NewApplication parentUrl={url} />} />
          <PrivateRoute path={`${path}/application-details/:id`} component={() => <ApplicationDetails parentRoute={path} />} />
          <PrivateRoute path={`${path}/property-details/:id`} component={() => <PropertyDetails parentRoute={path} />} />
          <PrivateRoute path={`${path}/assessment-details/:id`} component={() => <AssessmentDetails parentRoute={path} />} />
          <PrivateRoute path={`${path}/modify-application/:id`} component={() => <EditApplication />} />
          {/**/}
          <PrivateRoute path={`${path}/response`} component={(props) => <Response {...props} parentRoute={path} />} />
          <PrivateRoute path={`${path}/property-mutate/:id`} component={() => <TransferOwnership parentRoute={path} />} />
          <PrivateRoute path={`${path}/property-mutate-docs-required/:id`} component={() => <DocsRequired parentRoute={path} />} />
          <PrivateRoute
            path={`${path}/search`}
            component={() => (
              <Inbox
                parentRoute={path}
                businessService="PT"
                middlewareSearch={searchMW}
                initialStates={inboxInitialState}
                isInbox={false}
                EmptyResultInboxComp={"PTEmptyResultInbox"}
              />
            )}
          />
        </div>
      </React.Fragment>
    </Switch>
  );
};

export default EmployeeApp;
