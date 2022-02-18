import React from "react";
import {
  PersonIcon,
  ShippingTruck,
  SurveyIconSolid,
  EventsIconSolid,
  PTIcon,
  PropertyHouse,
  HomeIcon,
} from "@egovernments/digit-ui-react-components";

const EmployeeSideBarMenu = (t, ADMIN) => [
  ADMIN && {
    Icon: <PersonIcon />,
    moduleName: t("ACTION_TEST_HRMS"),
    links: [
      {
        label: t("HR_HOME_SEARCH_RESULTS_HEADING"),
        link: `/digit-ui/employee/hrms/inbox`,
      },
      {
        label: t("HR_COMMON_CREATE_EMPLOYEE_HEADER"),
        link: `/digit-ui/employee/hrms/create`,
      },
    ],
  },

  {
    Icon: <ShippingTruck />,
    moduleName: t("ES_TITLE_FAECAL_SLUDGE_MGMT"),
    links: [
      {
        label: t("ES_COMMON_INBOX"),
        link: `/digit-ui/employee/fsm/inbox`,
      },
      {
        label: t("ES_TITLE_NEW_DESULDGING_APPLICATION"),
        link: `/digit-ui/employee/fsm/new-application`,
      },
    ],
  },
  {
    Icon: <SurveyIconSolid />,
    moduleName: t("CS_COMMON_SURVEYS"),
    links: [
      {
        label: t("ES_TITLE_INBOX"),
        link: `/digit-ui/employee/engagement/surveys/inbox`,
      },
      {
        label: t("CS_COMMON_NEW_SURVEY"),
        link: `/digit-ui/employee/engagement/surveys/create`,
      },
    ],
  },
  {
    Icon: <EventsIconSolid />,
    moduleName: t("TOTAL_EVENTS"),
    links: [
      {
        label: t("ES_TITLE_INBOX"),
        link: `/digit-ui/employee/engagement/event/inbox`,
      },
      {
        label: t("ES_TITLE_NEW_EVENTS"),
        link: `/digit-ui/employee/engagement/event/new-event`,
      },
    ],
  },
  {
    Icon: <PTIcon />,
    moduleName: t("UC_COMMON_HEADER_SEARCH"),

    links: [
      {
        label: t("UC_SEARCH_CHALLAN_LABEL"),
        link: `/digit-ui/employee/mcollect/inbox`,
      },
      {
        label: t("UC_GENERATE_NEW_CHALLAN"),
        link: `/digit-ui/employee/mcollect/new-application`,
      },
    ],
  },
  {
    Icon: <PropertyHouse />,
    moduleName: t("ES_TITLE_PROPERTY_TAX"),
    links: [
      {
        label: t("ES_COMMON_INBOX"),
        link: `/digit-ui/employee/pt/inbox`,
      },
      {
        label: t("SEARCH_PROPERTY"),
        link: `/digit-ui/employee/pt/search`,
      },
      {
        label: t("ES_COMMON_APPLICATION_SEARCH"),
        link: `/digit-ui/employee/pt/application-search`,
      },
    ],
  },
];
export default EmployeeSideBarMenu;
