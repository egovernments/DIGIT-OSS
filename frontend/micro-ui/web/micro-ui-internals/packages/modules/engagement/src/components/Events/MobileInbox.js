import React from "react";
import { format } from "date-fns";
import ApplicationCard from "./ApplicationCard";
import EventLink from "./EventLink";

const MobileInbox = ({ data, t, searchFields, searchParams, onFilterChange, onSearch, isLoading }) => {
  const getData = () => {
    return data?.
    filter(event =>
      (searchParams?.eventStatus?.length > 0 ? searchParams?.eventStatus?.includes(event.status) : true) &&
      (searchParams?.eventName ? event.name?.startsWith(searchParams?.eventName) : true) &&
      (searchParams?.ulb?.code ? event.tenantId === searchParams?.ulb?.code : true) &&
      (searchParams?.eventCategory ? event.eventCategory === searchParams?.eventCategory?.code : true))
    .map((event) => {
      return {
        [t("EVENTS_EVENT_NAME_LABEL")]: event?.name,
        [t("EVENTS_EVENT_CATEGORY_LABEL")]: t(`MSEVA_EVENTCATEGORIES_${event?.eventCategory}`),
        [t("EVENTS_START_DATE_LABEL")]: format(new Date(event?.eventDetails?.fromDate), 'dd/MM/yyyy'),
        [t("EVENTS_END_DATE_LABEL")]: format(new Date(event?.eventDetails?.toDate), 'dd/MM/yyyy'),
        [t("EVENTS_POSTEDBY_LABEL")]: event?.user?.name,
        [t("EVENTS_STATUS_LABEL")]: t(event?.status)
      }
    })
  }
  return (
    <div style={{ padding: 0 }}>
      <div className="inbox-container">
        <div className="filters-container">
          {/* {!isFstpOperator && !isSearch && <ApplicationLinks linkPrefix={parentRoute} isMobile={true} />} */}
          <EventLink />
          <ApplicationCard
            t={t}
            data={getData()}
            onFilterChange={onFilterChange}
            // serviceRequestIdKey={isFstpOperator ? t("ES_INBOX_VEHICLE_LOG") : DSO ? t("ES_INBOX_APPLICATION_NO") : t("ES_INBOX_APPLICATION_NO")}
            // isFstpOperator={isFstpOperator}
            isLoading={isLoading}
            // isSearch={isSearch}
            onSearch={onSearch}
            // onSort={onSort}
            searchParams={searchParams}
            searchFields={searchFields}
            // linkPrefix={linkPrefix}
            // removeParam={removeParam}
            // sortParams={sortParams}
          />
        </div>
      </div>
    </div>
  )
};

export default MobileInbox;