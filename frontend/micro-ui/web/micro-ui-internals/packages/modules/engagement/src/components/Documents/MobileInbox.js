import React from "react";
import ApplicationCard from "./ApplicationCard";
import EventLink from "../Events/EventLink";

const GetStatusCell = (value) => value === "Active" ? <span className="sla-cell-success">{value}</span> : <span className="sla-cell-error">{value}</span> 

const MobileInbox = ({ data, t, title, iconName, links, searchFields, searchParams, onFilterChange, onSearch, isLoading }) => {
  const getData = () => {
    return data?.
    filter(document =>
      (searchParams?.tenantIds?.length > 0 ? searchParams?.tenantIds?.includes(document.tenantId) : true) &&
      (searchParams?.name ? document.name?.toUpperCase().startsWith(searchParams?.name?.toUpperCase()) : true) &&
      (searchParams?.postedBy ? document.postedBy?.trim()?.toLowerCase() === searchParams?.postedBy?.trim()?.toLowerCase() : true) &&
      (searchParams?.category ? document.category === searchParams?.category : true))
    .map((document) => {
      return {
        [t("CE_TABLE_DOCUMENT_NAME")]: document?.name,
        [t("DOCUMENTS_CATEGORY_CARD_LABEL")]: t(`${document?.category}`),
        [t("CE_TABLE_DOCUMENT_LINK")]: document?.documentLink,
        [t("CE_TABLE_DOCUMENT_POSTED_BY")]: document?.postedBy
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