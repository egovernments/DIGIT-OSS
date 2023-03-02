import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRightInbox, ShippingTruck, EmployeeModuleCard, AddNewIcon, ViewReportIcon, InboxIcon } from "@egovernments/digit-ui-react-components";
import { checkForEmployee } from "../utils";
const ArrowRight = ({ to }) => (
  <Link to={to}>
    <ArrowRightInbox />
  </Link>
);

const FSMCard = () => {
  const { t } = useTranslation();
  const DSO = Digit.UserService.hasAccess(["FSM_DSO"]) || false;
  const COLLECTOR = Digit.UserService.hasAccess("FSM_COLLECTOR") || false;
  const FSM_ADMIN = Digit.UserService.hasAccess("FSM_ADMIN") || false;
  const FSM_EDITOR = Digit.UserService.hasAccess("FSM_EDITOR_EMP") || false;
  const FSM_CREATOR = Digit.UserService.hasAccess("FSM_CREATOR_EMP") || false;
  const isFSTPOperator = Digit.UserService.hasAccess("FSM_EMP_FSTPO") || false;

  // Septage ready for Disposal ( 10 KL)
  // Septage disposed today ( 50 KL)
  const tenantId = Digit.ULBService.getCurrentTenantId();

  // TO DO get day time

  if (!Digit.Utils.fsmAccess()) {
    return null;
  }

  const config = {
    enabled: isFSTPOperator ? true : false,
    select: (data) => {
      const info = data.vehicleTrip.reduce(
        (info, trip) => {
          const totalVol = trip.tripDetails.reduce((vol, details) => details.volume + vol, 0);
          info[t("ES_READY_FOR_DISPOSAL")] += totalVol / 1000;
          return info;
        },
        { [t("ES_READY_FOR_DISPOSAL")]: 0 }
      );
      info[t("ES_READY_FOR_DISPOSAL")] = `(${info[t("ES_READY_FOR_DISPOSAL")]} KL)`;
      return info;
    },
  };

  const { isLoading, data: info, isSuccess } = Digit.Hooks.fsm.useVehicleSearch({
    tenantId,
    filters: { applicationStatus: "WAITING_FOR_DISPOSAL" },
    config,
  });

  const filters = {
    sortBy: "createdTime",
    sortOrder: "DESC",
    total: true,
  };

  const getUUIDFilter = () => {
    if (FSM_EDITOR || FSM_CREATOR || COLLECTOR || FSM_ADMIN) return { uuid: { code: "ASSIGNED_TO_ALL", name: t("ES_INBOX_ASSIGNED_TO_ALL") } };
    else return { uuid: { code: "ASSIGNED_TO_ME", name: t("ES_INBOX_ASSIGNED_TO_ME") } };
  };

  const { data: inbox, isFetching: pendingApprovalRefetching, isLoading: isInboxLoading } = Digit.Hooks.fsm.useInbox(
    tenantId,
    { ...filters, limit: 10, offset: 0, ...getUUIDFilter() },
    {
      enabled: !isFSTPOperator ? true : false,
    }
  );

  const propsForFSTPO = {
    Icon: <ShippingTruck />,
    moduleName: t("ES_COMMON_FSTP_OPERATION"),
    // kpis: isSuccess ? Object.keys(info).map((key, index) => ({
    //             label: t(key),
    //             count: t(info[key]),
    //             link: "/digit-ui/employee/fsm/fstp-inbox"
    //         })): [],
    links: [
      {
        label: t("ES_COMMON_INBOX"),
        link: "/digit-ui/employee/fsm/fstp-inbox",
      },
      {
        label: t("ES_FSM_ADD_NEW_BUTTON"),
        link: "/digit-ui/employee/fsm/fstp-add-vehicle",
      },
      {
        label: t("ES_FSM_VIEW_REPORTS_BUTTON"),
        link: "/employee/report/fsm/FSMFSTPPlantWithVehicleLogReport",
        hyperlink: true,
      },
    ],
  };

  let links = [
    {
      link: "/employee/report/fsm/FSMDailyDesludingReport",
      hyperlink: true,
      label: t("ES_FSM_VIEW_REPORTS_BUTTON"),
      roles: ["FSM_ADMIN"],
    },
    {
      label: t("ES_TITLE_FSM_REGISTRY"),
      link: `/digit-ui/employee/fsm/registry`,
      roles: ["FSM_ADMIN"],
    },
    {
      label: t("ES_TITLE_NEW_DESULDGING_APPLICATION"),
      link: `/digit-ui/employee/fsm/new-application`,
      roles: ["FSM_CREATOR_EMP", "FSM_ADMIN"],
    },
    {
      label: t("ES_TITILE_SEARCH_APPLICATION"),
      link: `/digit-ui/employee/fsm/search`,
    },
  ];

  links = links.filter((link) => (link.roles ? checkForEmployee(link.roles) : true));

  const propsForModuleCard = {
    Icon: <ShippingTruck />,
    moduleName: t("ES_TITLE_FAECAL_SLUDGE_MGMT"),
    kpis: [
      {
        count: isInboxLoading ? "-" : inbox?.totalCount,
        label: t("TOTAL_FSM"),
        link: `/digit-ui/employee/fsm/inbox`,
      },
      {
        count: isInboxLoading ? "-" : inbox?.nearingSlaCount,
        label: t("TOTAL_NEARING_SLA"),
        link: `/digit-ui/employee/fsm/inbox`,
      },
    ],
    links: [
      {
        count: isInboxLoading ? "-" : inbox?.totalCount,
        link: "/digit-ui/employee/fsm/inbox",
        label: t("ES_COMMON_INBOX"),
      },
      ...links,
    ],
  };

  return isFSTPOperator ? (
    <EmployeeModuleCard {...propsForFSTPO} />
  ) : (
    <EmployeeModuleCard {...propsForModuleCard} longModuleName={true} FsmHideCount={false} />
  );
};
export default FSMCard;
