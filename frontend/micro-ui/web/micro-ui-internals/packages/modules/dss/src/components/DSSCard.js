import { EmployeeModuleCard, EventsIconSolid } from "@egovernments/digit-ui-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

const DSSCard = () => {
  const STADMIN = Digit.UserService.hasAccess("STADMIN");
  const NATADMIN = Digit.UserService.hasAccess("NATADMIN");
  const { t } = useTranslation();

  if (!STADMIN && !NATADMIN) {
    return null;
  }

  const propsForModuleCard = {
    Icon: <EventsIconSolid />,
    moduleName: NATADMIN?t("ACTION_TEST_NATDASHBOARD"):t("ES_TITLE_DSS"),
    links: [
      {
        label: t("ACTION_TEST_FSM"),
        link: NATADMIN?`/digit-ui/employee/dss/dashboard/fsm`:`/digit-ui/employee/dss/dashboard/fsm`,
      },
      {
        label: t("ACTION_TEST_MCOLLECT"),
        link:  NATADMIN?`/digit-ui/employee/dss/dashboard/national-mcollect`:`/digit-ui/employee/dss/dashboard/mCollect`,
      },
      {
        label: t("ACTION_TEST_WATER_&_SEWERAGE"),
        link:  NATADMIN?`/digit-ui/employee/dss/dashboard/national-ws`:`/digit-ui/employee/dss/dashboard/ws`,
      },
      {
        label: t("CS_COMMON_OBPS"),
        link:  NATADMIN?`/digit-ui/employee/dss/dashboard/nss-obps`:`/digit-ui/employee/dss/dashboard/obps`,
      },
      {
        label: t("ACTION_TEST_FIRE_NOC"),
        link:  NATADMIN?`/digit-ui/employee/dss/dashboard/national-firenoc`:`/digit-ui/employee/dss/dashboard/noc`,
      },
      
    ],
  };

  return <EmployeeModuleCard {...propsForModuleCard} />;
};

export default DSSCard;
