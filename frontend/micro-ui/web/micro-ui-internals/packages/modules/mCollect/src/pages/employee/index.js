import React from "react";
import { MCollectLinks } from "../../Module";
import Inbox from "./Inbox";
import { Switch, useLocation, Link } from "react-router-dom";
import { PrivateRoute } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
// import EmployeeChallan from "../../EmployeeChallan";
// import CreateChallen from "../employee/CreateChallan";
// import MCollectAcknowledgement from "../employee/EmployeeChallanAcknowledgement";
// import EditChallan from "../employee/EditChallan/index";
// import NewChallan from "./NewChallan";
const EmployeeApp = ({ path, url, userType }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const mobileView = innerWidth <= 640;

  const inboxInitialState = {
    searchParams: {
      // uuid: { code: "ASSIGNED_TO_ALL", name: "ES_INBOX_ASSIGNED_TO_ALL" },
      // services: ["PT.CREATE"],
      status: [],
      businessService: [],
      // locality: [],
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
      returnData = searchData.map((e) => ({ ...e, due_tax: "₹ " + (obj[e.propertyId] || 0) }));
    } catch (er) {
      const err = er?.response?.data;
      if (["EG_BS_BILL_NO_DEMANDS_FOUND", "EMPTY_DEMANDS"].includes(err?.Errors?.[0].code)) {
        returnData = searchData.map((e) => ({ ...e, due_tax: "₹ " + 0 }));
      }
    }
    return _next(returnData);
  };

  const searchMW = [{ combineTaxDueInSearchData }];

  const EmployeeChallan = Digit?.ComponentRegistryService?.getComponent('MCollectEmployeeChallan');
  const MCollectAcknowledgement = Digit?.ComponentRegistryService?.getComponent('MCollectAcknowledgement');
  const EditChallan = Digit?.ComponentRegistryService?.getComponent('MCollectEditChallan');
  const NewChallan = Digit?.ComponentRegistryService?.getComponent('MCollectNewChallan');

  return (
    <Switch>
      <React.Fragment>
        <div className="ground-container" /* style={{ padding: "10px 0px 0px 30px" }} */>
          <p className="breadcrumb employee-main-application-details"  style={{ marginLeft: mobileView ? "2vw" : "revert" }}>
            <Link to="/digit-ui/employee" style={{ cursor: "pointer", color: "#666" }}>
              {t("ES_COMMON_HOME")}
            </Link>{" "}
            / <span>{location.pathname === "/digit-ui/employee/mcollect/inbox" ? t("UC_SEARCH_HEADER") : t("UC_COMMON_HEADER_SEARCH")}</span>
          </p>
          <PrivateRoute exact path={`${path}/`} component={() => <MCollectLinks matchPath={path} userType={userType} />} />
          <PrivateRoute
            path={`${path}/inbox`}
            component={() => (
              <Inbox
                parentRoute={path}
                businessService="PT"
                filterComponent="MCOLLECT_INBOX_FILTER"
                initialStates={inboxInitialState}
                isInbox={true}
              />
            )}
          />
{/*           <PrivateRoute path={`${path}/new-application`} component={() => <CreateChallen />} />
 */}          <PrivateRoute path={`${path}/new-application`} component={() => <NewChallan parentUrl={url} />} />
          <PrivateRoute
            path={`${path}/search`}
            component={() => (
              <Inbox parentRoute={path} businessService="PT" middlewareSearch={searchMW} initialStates={inboxInitialState} isInbox={false} />
            )}
          />
          <PrivateRoute path={`${path}/acknowledgement`} component={() => <MCollectAcknowledgement />} />
          <PrivateRoute path={`${path}/challansearch/:challanno`} component={() => <EmployeeChallan />} />
          <PrivateRoute path={`${path}/modify-challan/:challanNo`} component={() => <EditChallan />} />{" "}
        </div>
      </React.Fragment>
    </Switch>
  );
};

export default EmployeeApp;
