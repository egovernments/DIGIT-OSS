import { EmployeeModuleCard, EventsIconSolid } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const nationalScreenURLs = {
  propertytax: { key: "national-propertytax",stateKey:"propertytax", label: "ACTION_TEST_PROPERTY_TAX" ,active:false,nActive:true},
  tradelicense: { key: "national-tradelicense",stateKey:"tradelicense", label: "ACTION_TEST_TRADELICENSE" ,active:false,nActive:true},
  pgr: { key: "national-pgr",stateKey:"pgr", label: "ACTION_TEST_PGR" ,active:false,nActive:true},
  fsm: { key: "fsm",stateKey:"fsm", label: "ACTION_TEST_FSM" ,active:true,nActive:false},
  mCollect: { key: "national-mcollect",stateKey:"mCollect", label: "ACTION_TEST_MCOLLECT"  ,active:true,nActive:true},
  ws: { key: "national-ws",stateKey:"ws", label: "ACTION_TEST_WATER_&_SEWERAGE" ,active:true,nActive:true},
  obps: { key: "nss-obps",stateKey:"obps", label: "CS_COMMON_OBPS",active:true,nActive:true },
  noc: { key: "national-firenoc",stateKey:"noc", label: "ACTION_TEST_FIRE_NOC",active:true,nActive:true },
  overview: { key: "national-overview",stateKey:"overview", label: "ACTION_TEST_OVERVIEW" ,active:false,nActive:false},
};

export const checkCurrentScreen = () => {
  const moduleName=Digit.Utils.dss.getCurrentModuleName();
  const nationalURLS = Object.keys(nationalScreenURLs).map((key) => nationalScreenURLs[key].key);
  return nationalURLS.some((e) => moduleName?.includes(e));
};

const DSSCard = () => {
  const STADMIN = Digit.UserService.hasAccess("STADMIN");
  const NATADMIN = Digit.UserService.hasAccess("NATADMIN");
  const { t } = useTranslation();

  if (!STADMIN && !NATADMIN) {
    return null;
  }

  let links = Object.values(nationalScreenURLs).filter(ele=>ele[NATADMIN?"nActive":"active"]==true).map((obj) => ({
    label: t(obj?.label),
    link: `/digit-ui/employee/dss/dashboard/${NATADMIN ? obj?.key : obj?.stateKey}`,
  }));

  const propsForModuleCard = {
    Icon: <EventsIconSolid />,
    moduleName: NATADMIN ? t("ACTION_TEST_NATDASHBOARD") : t("ES_TITLE_DSS"),
    links: [...links],
  };
  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default DSSCard;
