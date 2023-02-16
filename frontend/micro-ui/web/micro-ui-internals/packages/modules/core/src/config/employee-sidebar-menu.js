import React from "react";
import {
  PersonIcon,
  ShippingTruck,
  SurveyIconSolid,
  EventsIconSolid,
  PTIcon,
  PropertyHouse,
  PMBIconSolid,
  DocumentIconSolid,
  ReceiptIcon,
  CaseIcon,
  ComplaintIcon,
} from "@egovernments/digit-ui-react-components";

const EmployeeSideBarMenu = (t, HRMS, FSM, PT, mCollect, DSS, RECEIPTS, TL, NOC, FSTPOperator, PGR, ...links) => [
  HRMS && {
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
  FSM && {
    Icon: <ShippingTruck />,
    moduleName: t("ES_TITLE_FAECAL_SLUDGE_MGMT"),
    links: [
      {
        label: t("ES_COMMON_INBOX"),
        link: `/digit-ui/employee/fsm/inbox`,
      },
    ],
  },

  mCollect && {
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
  PT && {
    Icon: <PropertyHouse />,
    moduleName: t("ES_TITLE_PROPERTY_TAX"),
  },
  DSS && {
    Icon: <PMBIconSolid />,
    moduleName: t("ACTION_TEST_PUBLIC_MESSAGE_BROADCAST"),

    links: [
      {
        label: t("ES_TITLE_INBOX"),
        link: `/digit-ui/employee/engagement/messages/inbox`,
      },
      {
        label: t("NEW_PUBLIC_MESSAGE_BUTTON_LABEL"),
        link: `/digit-ui/employee/engagement/messages/create`,
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
    Icon: <DocumentIconSolid />,
    moduleName: t("ES_TITLE_DOCS"),
    links: [
      {
        label: t("ES_TITLE_INBOX"),
        link: `/digit-ui/employee/engagement/documents/inbox`,
      },
      {
        label: t("NEW_DOCUMENT_TEXT"),
        link: `/digit-ui/employee/engagement/documents/new-doc`,
      },
    ],
  },
  RECEIPTS && {
    Icon: <ComplaintIcon />,
    moduleName: t("ACTION_TEST_RECEIPTS"),

    links: [
      {
        label: t("CR_SEARCH_COMMON_HEADER"),
        link: `/digit-ui/employee/receipts/inbox`,
      },
    ],
  },
  TL && {
    Icon: <CaseIcon />,
    moduleName: t("TL_COMMON_TL"),
    links: links,
  },
  NOC && {
    Icon: <ComplaintIcon />,
    moduleName: t("ACTION_TEST_NOC"),

    links: [
      {
        label: t("ES_COMMON_INBOX"),
        link: `/digit-ui/employee/noc/inbox`,
      },
      {
        label: t("ES_COMMON_SEARCH"),
        link: `/digit-ui/employee/noc/search`,
      },
    ],
  },
  FSTPOperator && {
    Icon: <ShippingTruck />,
    moduleName: t("ES_TITLE_VEHICLE_LOG"),

    links: [
      {
        label: t("ES_COMMON_INBOX"),
        link: "/digit-ui/employee/fsm/fstp-inbox",
      },
    ],
  },
  PGR && {
    Icon: <ComplaintIcon />,
    moduleName: t("ES_PGR_HEADER_COMPLAINT"),
  },
];
export default EmployeeSideBarMenu;
