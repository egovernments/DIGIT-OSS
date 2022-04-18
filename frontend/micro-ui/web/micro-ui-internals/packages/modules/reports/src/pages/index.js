import { PrivateRoute } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link, Switch, useLocation } from "react-router-dom";
import Report from "./Report";
const EmployeeApp = ({ path, url, userType }) => {
    const { t } = useTranslation();
    const location = useLocation();
    const mobileView = innerWidth <= 640;
    const tenantId = Digit.ULBService.getCurrentTenantId();
    return (
        <Switch>
            <React.Fragment>
                <div className="ground-container">
                    {/* <p className="breadcrumb" style={{ marginLeft: mobileView ? "2vw" : "revert" }}>
                        <Link to="/digit-ui/employee" style={{ cursor: "pointer", color: "#666" }}>
                            {t("ES_COMMON_HOME")}
                        </Link>{" "}
                        / <span>{location.pathname === "/digit-ui/employee/receipts/inbox" ? t("CR_COMMON_HEADER") : t("CR_COMMON_HEADER")}</span>
                    </p> */}
                    <PrivateRoute path={`${path}/search/:moduleName/:reportName`} component={() => <Report />} />
                </div>
            </React.Fragment>
        </Switch>
    );
};

export default EmployeeApp;
