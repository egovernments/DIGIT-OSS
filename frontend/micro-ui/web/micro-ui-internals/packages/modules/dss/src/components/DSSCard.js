import { ModuleCardFullWidth } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const nationalScreenURLs = {
  overview: { key: "national-overview", stateKey: "overview", label: "NURT_OVERVIEW", active: true, nActive: true },
  propertytax: { key: "national-propertytax", stateKey: "propertytax", label: "NURT_PROPERTY_TAX", active: true, nActive: true },
  tradelicense: { key: "national-tradelicense", stateKey: "tradelicense", label: "NURT_TRADE_LICENCE", active: true, nActive: true },
  pgr: { key: "national-pgr", stateKey: "pgr", label: "NURT_COMPLAINS", active: true, nActive: true },
  fsm: { key: "fsm", stateKey: "fsm", label: "CS_HOME_FSM_SERVICES", active: true, nActive: false },
  mCollect: { key: "national-mcollect", stateKey: "mCollect", label: "NURT_MCOLLECT", active: true, nActive: true },
  ws: { key: "national-ws", stateKey: "ws", label: "NURT_WATER_SEWERAGE", active: true, nActive: true },
  obps: { key: "nss-obps", stateKey: "obps", label: "DSS_BUILDING_PERMISSION", active: true, nActive: true },
  noc: { key: "national-firenoc", stateKey: "noc", label: "NURT_FIRENOC", active: true, nActive: true },
  bnd: {key:"nss-birth-death",stateKey:"birth-death",label:"BIRTH_AND_DEATH",active:true,nActive:true},
  faqs: {key:"national-faqs",stateKey:"national-faqs",label:"DSS_FAQS",active:false,nActive:true,others:true},
  finance: {key:"national-finance",stateKey:"finance",label:"DSS_FINANCE",active:true,nActive:false},
  about: {key:"national-about",stateKey:"national-about",label:"DSS_ABOUT_DASHBOARD",active:false,nActive:true,others:true},
};

export const checkCurrentScreen = () => {
  const moduleName = Digit.Utils.dss.getCurrentModuleName();
  const nationalURLS = Object.keys(nationalScreenURLs).map((key) => nationalScreenURLs[key].key);
  return nationalURLS.filter(ele=>ele!=="fsm").some((e) => moduleName?.includes(e));
};

const NDSSCard = () => {
  const NATADMIN = Digit.UserService.hasAccess("NATADMIN");
  const { t } = useTranslation();

  if (!NATADMIN) {
    return null;
  }

  let links = Object.values(nationalScreenURLs)
    .filter((ele) => ele["nActive"] === true)
    .map((obj) => ({
      label: t(obj?.label),
      link: `/${window?.contextPath}/employee/dss/dashboard/${obj?.key}`,
      link: obj?.others?`/${window?.contextPath}/employee/dss/${obj?.key}`:`/${window?.contextPath}/employee/dss/dashboard/${obj?.key}`,
    }));

  const propsForModuleCard = {
    headerStyle: { border: "none", height: "48px" },
    moduleName: t("ACTION_TEST_NATDASHBOARD"),
    subHeader: t("ACTION_TEST_NATDASHBOARD"),
    // subHeaderLink: `/digit-ui/employee/payment/integration/dss/NURT_DASHBOARD`,
    subHeaderLink: `/${window?.contextPath}/employee/dss/landing/NURT_DASHBOARD`,
    className: "employeeCard customEmployeeCard card-home full-width-card full-employee-card-height",
    links: [...links],
  };
  return <ModuleCardFullWidth {...propsForModuleCard} />;
};

const DSSCard = () => {
  const STADMIN = Digit.UserService.hasAccess("STADMIN");
  const { t } = useTranslation();

  if (!STADMIN) {
    return null;
  }

  let links = Object.values(nationalScreenURLs)
    .filter((ele) => ele["active"] === true)
    .map((obj) => ({
      label: t(obj?.label),
      link: obj.active?`/${window?.contextPath}/employee/dss/dashboard/${obj?.stateKey}`:`/employee/integration/dss/${obj?.stateKey}`,
    }));

  const propsForModuleCard = {
    headerStyle: { border: "none", height: "48px" },
    moduleName: t("ES_TITLE_DSS"),
    subHeader: t("ACTION_TEST_SURE_DASHBOARD"),
    // subHeaderLink: `/digit-ui/employee/payment/integration/dss/home`,
    subHeaderLink: `/${window?.contextPath}/employee/dss/landing/home`,
    className: "employeeCard card-home customEmployeeCard full-width-card full-employee-card-height",
    links: [...links],
  };
  return <ModuleCardFullWidth {...propsForModuleCard} styles={{ width: "100%" }} />;
};

export { DSSCard, NDSSCard };
