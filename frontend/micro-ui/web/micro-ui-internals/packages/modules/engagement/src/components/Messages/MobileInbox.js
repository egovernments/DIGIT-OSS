import React from "react";
import { format, isValid } from "date-fns";
import ApplicationCard from "./ApplicationCard";
import EventLink from "./EventLink";

const GetStatusCell = (value) => value === "Active" ? <span className="sla-cell-success">{value}</span> : <span className="sla-cell-error">{value}</span> 

const MobileInbox = ({ data, t, title, iconName, links, searchFields, searchParams, onFilterChange, onSearch, isLoading }) => {
  const getData = () => {
    return data?.
    filter(event =>
      (searchParams?.eventStatus?.length > 0 ? searchParams?.eventStatus?.includes(event.status) : true) &&
      (searchParams?.eventName ? event.name?.toUpperCase().startsWith(searchParams?.eventName?.toUpperCase()) : true) &&
      (searchParams?.ulb?.code ? event.tenantId === searchParams?.ulb?.code : true) &&
      (searchParams?.eventCategory ? event.eventCategory === searchParams?.eventCategory?.code : true) &&
      (isValid(searchParams?.range?.startDate) ? event.eventDetails?.fromDate >= new Date(searchParams?.range?.startDate).getTime() : true) &&
      (isValid(searchParams?.range?.endDate) ? event.eventDetails?.toDate <= new Date(searchParams?.range?.endDate).getTime() : true))
    .map((event) => {
      return {
        [t("PUBLIC_BRDCST_TITLE_LABEL")]: event?.name,
        [t("EVENTS_POSTING_DATE_LABEL")]: format(new Date(event?.auditDetails?.createdTime), 'dd/MM/yyyy'),
        [t("EVENTS_START_DATE_LABEL")]: format(new Date(event?.eventDetails?.fromDate), 'dd/MM/yyyy'),
        [t("EVENTS_END_DATE_LABEL")]: format(new Date(event?.eventDetails?.toDate), 'dd/MM/yyyy'),
        [t("EVENTS_POSTEDBY_LABEL")]: event?.user?.name,
        [t("EVENTS_STATUS_LABEL")]: GetStatusCell(t(event?.status))
      }
    })
  }
  return (
    <div style={{ padding: 0 }}>
      <div className="inbox-container">
        <div className="filters-container">
          {/* {!isFstpOperator && !isSearch && <ApplicationLinks linkPrefix={parentRoute} isMobile={true} />} */}
          <EventLink title={title} icon={iconName} links={links} />
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
            responseData={data}
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