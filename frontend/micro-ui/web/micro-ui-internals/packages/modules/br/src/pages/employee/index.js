import { PrivateRoute,BreadCrumb } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link, Switch, useLocation } from "react-router-dom";
import { BRLinks } from "../../Module";


const EmployeeApp = ({ path, url, userType }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const mobileView = innerWidth <= 640;
  sessionStorage.removeItem("revalidateddone");
  const isMobile = window.Digit.Utils.browser.isMobile();

  const inboxInitialState = {
    searchParams: {
      uuid: { code: "ASSIGNED_TO_ALL", name: "ES_INBOX_ASSIGNED_TO_ALL" },
      services: ["PT.CREATE", "PT.MUTATION", "PT.UPDATE"],
      applicationStatus: [],
      locality: [],
    },
  };

  // const combineTaxDueInSearchData = async (searchData, _break, _next) => {
  //   let returnData;
  //   const tenantId = Digit.ULBService.getCurrentTenantId();
  //   let businessService = ["PT"].join();
  //   let consumerCode = searchData.map((e) => e.propertyId).join();
  //   try {
  //     const res = await Digit.PaymentService.fetchBill(tenantId, { consumerCode, businessService });
  //     let obj = {};
  //     res.Bill.forEach((e) => {
  //       obj[e.consumerCode] = e.totalAmount;
  //     });
  //     returnData = searchData.map((e) => ({ ...e, due_tax: obj[e.propertyId] || 0 }));
  //   } catch (er) {
  //     const err = er?.response?.data;
  //     if (["EG_BS_BILL_NO_DEMANDS_FOUND", "EMPTY_DEMANDS"].includes(err?.Errors?.[0].code)) {
  //       returnData = searchData.map((e) => ({ ...e, due_tax: 0 }));
  //     }
  //   }
  //   return _next(returnData);
  // };

  // const searchMW = [{ combineTaxDueInSearchData }];

  // const breadcrumbObj = {
  //   ["/digit-ui/employee/pt/inbox"]: "ES_TITLE_INBOX",
  //   ["/digit-ui/employee/pt/new-application"]: "ES_TITLE_NEW_PROPERTY_APPLICATION",
  //   ["/digit-ui/employee/pt/search"]: "PT_COMMON_SEARCH_PROPERTY_SUB_HEADER",
  //   ["/digit-ui/employee/pt/application-search"]: "ES_COMMON_APPLICATION_SEARCH",
  // };

  // const getBreadCrumb = () => {
  //   if (breadcrumbObj[location.pathname]) return t(breadcrumbObj[location.pathname]);
  //   else if (location.pathname.includes("/digit-ui/employee/pt/application-details/")) return t("PT_APPLICATION_TITLE");
  //   else if (location.pathname.includes("/digit-ui/employee/pt/property-details/")) return t("PT_PROPERTY_INFORMATION");
  //   else if (location.pathname.includes("/digit-ui/employee/pt/payment-details/")) return t("PT_PAYMENT_HISTORY");
  //   else if (location.pathname.includes("/digit-ui/employee/pt/assessment-details/")) return t("PT_ASSESS_PROPERTY");
  //   else if (location.pathname.includes("digit-ui/employee/pt/property-mutate-docs-required")) return t("PT_REQIURED_DOC_TRANSFER_OWNERSHIP");
  //   else if (location.pathname.includes("/digit-ui/employee/pt/property-mutate/")) return t("ES_TITLE_MUTATE_PROPERTY");
  //   else if (location.pathname.includes("/digit-ui/employee/pt/modify-application/")) return t("PT_UPDATE_PROPERTY");
  // };

  const BRBreadCrumbs = ({ location }) => {
    const { t } = useTranslation();
    const crumbs = [
      {
        path: "/digit-ui/employee",
        content: t("ES_COMMON_HOME"),
        show: true,
      },
      {
        path: "/digit-ui/employee/br/inbox",
        content: t("ES_TITLE_INBOX"),
        show: location.pathname.includes("br/inbox") ? true : false,
      },
      
    ];
  
    return <BreadCrumb style={isMobile?{display:"flex"}:{}}  spanStyle={{maxWidth:"min-content"}} crumbs={crumbs} />;
  }

  // const NewApplication = Digit?.ComponentRegistryService?.getComponent("PTNewApplication");
  // const ApplicationDetails = Digit?.ComponentRegistryService?.getComponent("ApplicationDetails");
  // const PropertyDetails = Digit?.ComponentRegistryService?.getComponent("PTPropertyDetails");
  // const AssessmentDetails = Digit?.ComponentRegistryService?.getComponent("PTAssessmentDetails");
  // const EditApplication = Digit?.ComponentRegistryService?.getComponent("PTEditApplication");
  // const Response = Digit?.ComponentRegistryService?.getComponent("PTResponse");
  // const TransferOwnership = Digit?.ComponentRegistryService?.getComponent("PTTransferOwnership");
  // const DocsRequired = Digit?.ComponentRegistryService?.getComponent("PTDocsRequired");
  // const isRes = window.location.href.includes("pt/response");
  // const isLocation = window.location.href.includes("pt") || window.location.href.includes("application");
  // const isNewRegistration = window.location.href.includes("new-application") || window.location.href.includes("modify-application") || window.location.href.includes("pt/application-details");
  return (
    <Switch>
      <React.Fragment>
        <div className="ground-container">
          {/* <p className="breadcrumb" style={{ marginLeft: mobileView ? "2vw" : "revert" }}>
            <Link to="/digit-ui/employee" style={{ cursor: "pointer", color: "#666" }}>
              {t("ES_COMMON_HOME")}
            </Link>{" "}
            / <span>{getBreadCrumb()}</span>
          </p>} */}
          {!isRes ? <div style={isNewRegistration ? {marginLeft: "12px" } : {marginLeft:"-4px"}}><PTBreadCrumbs location={location} /></div> : null}
          <PrivateRoute exact path={`${path}/`} component={() => <BRLinks matchPath={path} userType={userType} />} />
        
          {/* <PrivateRoute path={`${path}/new-application`} component={() => <NewApplication parentUrl={url} />} /> */}
          {/* <PrivateRoute path={`${path}/search`} component={(props) => <Search {...props} t={t} parentRoute={path} />} />
          <PrivateRoute
            path={`${path}/searchold`}
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
          /> */}
       
        </div>
      </React.Fragment>
    </Switch>
  );
};

export default EmployeeApp;
