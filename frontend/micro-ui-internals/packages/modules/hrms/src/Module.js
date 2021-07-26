import React from "react";
import { Switch, useRouteMatch, useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PrivateRoute } from "@egovernments/digit-ui-react-components";
import Inbox from "./pages/Inbox";
import HRMSCard from "./components/hrmscard";
import CreateEmployee from "./pages/createEmployee";
import EditEmpolyee from "./pages/EditEmployee/index";
import InboxFilter from "./components/InboxFilter";
import Jurisdictions from "./components/pageComponents/jurisdiction";
import Assignments from "./components/pageComponents/assignment";
import SelectEmployeeId from "./components/pageComponents/SelectEmployeeId";
import SelectDateofEmployment from "./components/pageComponents/SelectDateofEmployment";
import SelectEmployeeType from "./components/pageComponents/SelectEmployeeType";
import SelectEmployeePhoneNumber from "./components/pageComponents/EmployeePhoneNumber";
import SelectEmployeeName from "./components/pageComponents/SelectEmployeeName";
import SelectEmployeeEmailId from "./components/pageComponents/SelectEmailId";
import SelectEmployeeCorrespondenceAddress from "./components/pageComponents/SelectEmployeeCorrespondenceAddress";
import SelectEmployeeGender from "./components/pageComponents/SelectEmployeeGender";
import SelectDateofBirthEmployment from "./components/pageComponents/EmployeeDOB";
import Response from "./pages/Response";
import Banner from "./components/pageComponents/Banner";
import Details from "./pages/EmployeeDetails";
import ActionModal from "./components/Modal";

export const HRMSModule = ({ stateCode, userType, tenants }) => {
  const moduleCode = "HR";
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({ stateCode, moduleCode, language });
  const mobileView = innerWidth <= 640;
  const location = useLocation();
  const { t } = useTranslation();
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const inboxInitialState = {
    searchParams: {
      tenantId: tenantId,
    },
  };
  Digit.SessionStorage.set("HRMS_TENANTS", tenants);

  const { path, url } = useRouteMatch();

  if (!Digit.Utils.hrmsAccess()) {
    return null;
  }
  if (userType === "employee") {
    return (
      <Switch>
        <React.Fragment>
          <div className="ground-container">
            <p className="breadcrumb" style={{ marginLeft: mobileView ? "2vw" : "revert" }}>
              <Link to="/digit-ui/employee" style={{ cursor: "pointer", color: "#666" }}>
                {t("HR_COMMON_BUTTON_HOME")}
              </Link>{" "}
              / <span>{location.pathname === "/digit-ui/employee/hrms/inbox" ? t("HR_COMMON_HEADER") : t("HR_COMMON_HEADER")}</span>
            </p>
            <PrivateRoute
              path={`${path}/inbox`}
              component={() => (
                <Inbox
                  parentRoute={path}
                  businessService="hrms"
                  filterComponent="HRMS_INBOX_FILTER"
                  initialStates={inboxInitialState}
                  isInbox={true}
                />
              )}
            />
            <PrivateRoute path={`${path}/create`} component={() => <CreateEmployee />} />
            <PrivateRoute path={`${path}/response`} component={(props) => <Response {...props} parentRoute={path} />} />
            <PrivateRoute path={`${path}/details/:tenantId/:id`} component={() => <Details />} />
            <PrivateRoute path={`${path}/edit/:tenantId/:id`} component={() => <EditEmpolyee />} />
          </div>
        </React.Fragment>
      </Switch>
    );
  } else return null;
};

const componentsToRegister = {
  HRMSCard,
  Details,
  SelectEmployeeEmailId,
  SelectEmployeeName,
  SelectEmployeeId,
  Jurisdictions,
  Assignments,
  ActionModal,
  Banner,
  SelectEmployeePhoneNumber,
  SelectDateofEmployment,
  SelectEmployeeType,
  SelectEmployeeCorrespondenceAddress,
  SelectEmployeeGender,
  SelectDateofBirthEmployment,
  HRMSModule,
  HRMS_INBOX_FILTER: (props) => <InboxFilter {...props} />,
};

export const initHRMSComponents = () => {
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
