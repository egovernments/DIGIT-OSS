import React, { useEffect, useState } from "react";
import { Loader, ShippingTruck, EmployeeModuleCard } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

const svgIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
    <path d="M0 0h24v24H0z" fill="none"></path>
    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z" fill="white"></path>
  </svg>
);

const DsoDashboard = () => {
  const tenantId = Digit.ULBService.getCurrentTenantId();
  const { t } = useTranslation();
  const [total, setTotal] = useState("-");
  const [loader, setLoader] = useState(true);
  const [isDsoLoaded, setIsDsoLoaded] = useState(false);


  // fetch Status codes for DSO_ACTIONS

  const filters = {
    limit:10,
    offset:0,
    uuid: { code: "ASSIGNED_TO_ME", name: t("ES_INBOX_ASSIGNED_TO_ME") },
    sortBy: "createdTime",
    sortOrder: "DESC",
    total: true,
  };

  const { data:vendorDetails, isFetching: vendorDetailsFetching } = Digit.Hooks.fsm.useVendorDetail();

  useEffect(() => {
    if (vendorDetails?.vendor) {
      const { vendor } = vendorDetails;
      Digit.UserService.setExtraRoleDetails(vendor[0]);
      setIsDsoLoaded(true);
    }
  }, [vendorDetails]);

  const { data: inbox, isFetching: inboxFetching } = Digit.Hooks.fsm.useInbox(tenantId, { ...filters }, {
    enabled: isDsoLoaded,
  }, true );
  const info = useMemo( () => ({
    [t("ES_COMPLETION_PENDING")]: inbox?.statuses.filter(e => e.applicationstatus === "DSO_INPROGRESS")[0]?.count || 0,
    [t("ES_VEHICLE_ASSIGNMENT_PENDING")]: inbox?.statuses.filter(e => e.applicationstatus === "PENDING_DSO_APPROVAL")[0]?.count || 0,
  }),[inbox?.totalCount]);


  const links = useMemo(
    () => [
      {
        link: "/digit-ui/citizen/fsm/inbox",
        label: t("ES_TITLE_INBOX"),
        count: total,
      },
    ],
    [total]
  );

  useEffect(() => {
    if (inbox) {
      const total = inbox?.statuses.filter(e => e.applicationstatus === "DSO_INPROGRESS")[0]?.count + inbox?.statuses.filter(e => e.applicationstatus === "PENDING_DSO_APPROVAL")[0]?.count;
      setTotal(total);
      if (Object.keys(info).length) setLoader(false);
    }
  }, [info, inbox]);

  if (loader) {
    return <Loader />;
  }
  const propsForModuleCard = {
    Icon: <ShippingTruck />,
    moduleName: t("ES_TITLE_FAECAL_SLUDGE_MGMT"),
    kpis:[
      {
          count: inbox?.statuses.filter(e => e.applicationstatus === "DSO_INPROGRESS")[0]?.count || 0,
          label: t("ES_COMPLETION_PENDING"),
          link: `/digit-ui/citizen/fsm/inbox`
      },
      {
          count: inbox?.statuses.filter(e => e.applicationstatus === "PENDING_DSO_APPROVAL")[0]?.count || 0,
          label: t("ES_VEHICLE_ASSIGNMENT_PENDING"),
          link: `/digit-ui/citizen/fsm/inbox`
      }  
    ],
    links,

  }
  return (
    <div className="ground-container moduleCardWrapper">
      <EmployeeModuleCard {...propsForModuleCard} />
    </div>
  );
};

export default DsoDashboard;
