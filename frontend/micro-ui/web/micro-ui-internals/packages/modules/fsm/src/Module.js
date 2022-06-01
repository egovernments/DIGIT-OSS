import { CitizenHomeCard, CitizenTruck, Loader } from "@egovernments/digit-ui-react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useRouteMatch } from "react-router-dom";
import FSMCard from "./components/FsmCard";
import CheckSlum from "./pageComponents/CheckSlum";
import SelectAddress from "./pageComponents/SelectAddress";
import SelectChannel from "./pageComponents/SelectChannel";
import SelectGender from "./pageComponents/SelectGender";
import SelectPaymentType from "./pageComponents/SelectPaymentType";
import SelectGeolocation from "./pageComponents/SelectGeolocation";
import SelectLandmark from "./pageComponents/SelectLandmark";
import SelectName from "./pageComponents/SelectName";
import SelectPincode from "./pageComponents/SelectPincode";
import SelectPitType from "./pageComponents/SelectPitType";
import SelectPropertySubtype from "./pageComponents/SelectPropertySubtype";
import SelectPropertyType from "./pageComponents/SelectPropertyType";
import SelectSlumName from "./pageComponents/SelectSlumName";
import SelectStreet from "./pageComponents/SelectStreet";
import SelectTankSize from "./pageComponents/SelectTankSize";
import SelectTripData from "./pageComponents/SelectTripData";
import SelectTripNo from "./pageComponents/SelectTripNo";
import SelectPaymentPreference from "./pageComponents/SelectPaymentPreference";
import CitizenApp from "./pages/citizen";
import ApplicationDetails from "./pages/citizen/ApplicationDetails";
import { MyApplications } from "./pages/citizen/MyApplications";
import NewApplicationCitizen from "./pages/citizen/NewApplication/index";
import RateView from "./pages/citizen/Rating/RateView";
import SelectRating from "./pages/citizen/Rating/SelectRating";
import EmployeeApp from "./pages/employee";
import ApplicationAudit from "./pages/employee/ApplicationAudit";
import EmployeeApplicationDetails from "./pages/employee/ApplicationDetails";
import DsoDashboard from "./pages/employee/DsoDashboard";
import EditApplication from "./pages/employee/EditApplication";
import FstpInbox from "./pages/employee/FstpInbox";
import FstpOperatorDetails from "./pages/employee/FstpOperatorDetails";
import Inbox from "./pages/employee/Inbox";
import { NewApplication } from "./pages/employee/NewApplication";
import Response from "./pages/Response";
import {FsmBreadCrumb} from "./pages/employee";

const FSMModule = ({ stateCode, userType, tenants }) => {
  const moduleCode = "FSM";
  const { path, url } = useRouteMatch();
  const language = Digit.StoreData.getCurrentLanguage();
  const { isLoading, data: store } = Digit.Services.useStore({ stateCode, moduleCode, language });

  if (isLoading) {
    return <Loader />;
  }
  Digit.SessionStorage.set("FSM_TENANTS", tenants);

  if (userType === "citizen") {
    return <CitizenApp path={path} />;
  } else {
    return <EmployeeApp path={path} url={url} userType={userType} />;
  }
};

const FSMLinks = ({ matchPath, userType }) => {
  const { t } = useTranslation();
  const [params, setParams, clearParams] = Digit.Hooks.useSessionStorage("FSM_CITIZEN_FILE_PROPERTY", {});

  useEffect(() => {
    clearParams();
  }, []);

  const roleBasedLoginRoutes = [
    {
      role: "FSM_DSO",
      from: "/digit-ui/citizen/fsm/dso-dashboard",
      dashoardLink: "CS_LINK_DSO_DASHBOARD",
      loginLink: "CS_LINK_LOGIN_DSO",
    },
  ];

  if (userType === "citizen") {
    const links = [
      {
        link: `${matchPath}/new-application`,
        i18nKey: t("CS_HOME_APPLY_FOR_DESLUDGING"),
      },
      {
        link: `${matchPath}/my-applications`,
        i18nKey: t("CS_HOME_MY_APPLICATIONS"),
      },
    ];

    roleBasedLoginRoutes.map(({ role, from, loginLink, dashoardLink }) => {
      if (Digit.UserService.hasAccess(role))
        links.push({
          link: from,
          i18nKey: t(dashoardLink),
        });
      else
        links.push({
          link: `/digit-ui/citizen/login`,
          state: { role: "FSM_DSO", from },
          i18nKey: t(loginLink),
        });
    });

    return <CitizenHomeCard header={t("CS_HOME_FSM_SERVICES")} links={links} Icon={CitizenTruck} />;
  } else {
    return (
      <div className="employee-app-container">
        <div className="ground-container">
          <div className="employeeCard">
            <div className="complaint-links-container">
              <div className="header">
                <span className="logo">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                    <path d="M0 0h24v24H0z" fill="none"></path>
                    <path
                      d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z"
                      fill="white"
                    ></path>
                  </svg>
                </span>
                <span className="text">{t("ES_TITLE_FSM")}</span>
              </div>
              <div className="body">
                <span className="link">
                  <Link to={`${matchPath}/inbox`}>{t("ES_TITLE_INBOX")}</Link>
                </span>
                <span className="link">
                  <Link to={`${matchPath}/new-application/`}>{t("ES_TITLE_NEW_DESULDGING_APPLICATION")}</Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

const componentsToRegister = {
  SelectPropertySubtype,
  SelectPropertyType,
  SelectAddress,
  SelectStreet,
  SelectLandmark,
  SelectPincode,
  SelectTankSize,
  SelectPitType,
  SelectTripNo,
  SelectGeolocation,
  SelectSlumName,
  CheckSlum,
  FSMCard,
  FSMModule,
  FSMLinks,
  SelectChannel,
  SelectName,
  SelectTripData,
  SelectGender,
  SelectPaymentType,
  SelectPaymentPreference,
  FSMEmpInbox: Inbox,
  FSMFstpInbox: FstpInbox,
  FSMNewApplicationEmp: NewApplication,
  FSMEditApplication: EditApplication,
  FSMEmployeeApplicationDetails: EmployeeApplicationDetails,
  FSMFstpOperatorDetails: FstpOperatorDetails,
  FSMResponse: Response,
  FSMApplicationAudit: ApplicationAudit,
  FSMRateView: RateView,
  FSMNewApplicationCitizen: NewApplicationCitizen,
  FSMMyApplications: MyApplications,
  FSMCitizenApplicationDetails: ApplicationDetails,
  FSMSelectRating: SelectRating,
  FSMDsoDashboard: DsoDashboard,
  FsmBreadCrumb
};

export const initFSMComponents = () => {
  Object.entries(componentsToRegister).forEach(([key, value]) => {
    Digit.ComponentRegistryService.setComponent(key, value);
  });
};
