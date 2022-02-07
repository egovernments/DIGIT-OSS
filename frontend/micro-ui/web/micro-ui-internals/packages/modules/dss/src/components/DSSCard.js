import { EmployeeModuleCard, EventsIconSolid } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const nationalScreenURLs = {
  fsm: { key: "fsm", label: "ACTION_TEST_FSM" },
  mCollect: { key: "national-mcollect", label: "ACTION_TEST_MCOLLECT" },
  ws: { key: "national-ws", label: "ACTION_TEST_WATER_&_SEWERAGE" },
  obps: { key: "nss-obps", label: "CS_COMMON_OBPS" },
  noc: { key: "national-firenoc", label: "ACTION_TEST_FIRE_NOC" },
};

export const checkCurrentScreen = () => {
  const pathname = window.location.pathname;
  const nationalURLS = Object.keys(nationalScreenURLs).map((key) => nationalScreenURLs[key].key);
  return nationalURLS.some((e) => pathname?.includes(e));
};

const DSSCard = () => {
  const STADMIN = Digit.UserService.hasAccess("STADMIN");
  const NATADMIN = Digit.UserService.hasAccess("NATADMIN");
  const { t } = useTranslation();

  if (!STADMIN && !NATADMIN) {
    return null;
  }

  let links = Object.keys(nationalScreenURLs).map((key) => ({
    label: t(nationalScreenURLs?.[key]?.label),
    link: `/digit-ui/employee/dss/dashboard/${NATADMIN ? nationalScreenURLs[key].key : key}`,
  }));

  const propsForModuleCard = {
    Icon: <EventsIconSolid />,
    moduleName: NATADMIN ? t("ACTION_TEST_NATDASHBOARD") : t("ES_TITLE_DSS"),
    links: [...links],
  };
  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default DSSCard;
