import { PrivateRoute } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link, Switch, useLocation } from "react-router-dom";
import { getDefaultReceiptService } from "../utils";

const EmployeeApp = ({ path, url, userType }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const mobileView = innerWidth <= 640;
  const tenantId = Digit.ULBService.getCurrentTenantId();

  const inboxInitialState = {
    searchParams: {
      tenantId: tenantId,
      businessServices: getDefaultReceiptService(),
    },
  };

  const ReceiptInbox = Digit.ComponentRegistryService.getComponent("ReceiptInbox");
  const ReceiptAcknowledgement = Digit.ComponentRegistryService.getComponent("ReceiptAcknowledgement");
  const ReceiptDetails = Digit.ComponentRegistryService.getComponent("ReceiptDetails");

  return (
    <Switch>
      <React.Fragment>
        <div className="ground-container">
          <p className="breadcrumb" style={{ marginLeft: mobileView ? "2vw" : "revert" }}>
            <Link to="/digit-ui/employee" style={{ cursor: "pointer", color: "#666" }}>
              {t("ES_COMMON_HOME")}
            </Link>{" "}
            / <span>{location.pathname === "/digit-ui/employee/receipts/inbox" ? t("CR_COMMON_HEADER") : t("CR_COMMON_HEADER")}</span>
          </p>
          <PrivateRoute
            path={`${path}/inbox`}
            component={() => (
              <ReceiptInbox
                parentRoute={path}
                businessService="receipts"
                filterComponent="RECEIPTS_INBOX_FILTER"
                initialStates={inboxInitialState}
                isInbox={true}
              />
            )}
          />
          <PrivateRoute path={`${path}/inprogress`} component={(props) => <h2>{t("CR_RECEIPTS_SCREENS_UNDER_CONSTRUCTION")}</h2>} />
          <PrivateRoute path={`${path}/response`} component={(props) => <ReceiptAcknowledgement {...props} parentRoute={path} />} />
          <PrivateRoute path={`${path}/details/:service/:id`} component={() => <ReceiptDetails />} />
        </div>
      </React.Fragment>
    </Switch>
  );
};

export default EmployeeApp;
