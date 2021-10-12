import React from "react";
import ApplicationCard from "./ApplicationCard";

const MobileInbox = ({ data, t, title, iconName, links, searchFields, searchParams, onFilterChange, sortParams, onSearch, onSort, isLoading }) => {
  // return null;
  const getData = () => {
    return data?.table?.map(row => ({
      [t('BPA_COMMON_APP_NO')]: row?.applicationId,
      [t('BPA_BASIC_DETAILS_APPLICATION_TYPE_LABEL')]: row?.edcr?.appliactionType,
      [t('BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL')]: row?.edcr?.applicationSubType,
      [t('BPA_BASIC_DETAILS_APPLICATION_NAME_LABEL')]: row?.owner,
      [t('TL_COMMON_TABLE_COL_STATUS')]: row?.status,
      [t('BPA_COMMON_SLA')]: row?.sla,
    }))
  }
  return (
    <div style={{ padding: 0 }}>
      <div className="inbox-container">
        <div className="filters-container">
          {/* {!isFstpOperator && !isSearch && <ApplicationLinks linkPrefix={parentRoute} isMobile={true} />} */}
          {/* <EventLink title={title} icon={iconName} links={links} /> */}
          <ApplicationCard
            t={t}
            data={getData()}
            statusMap={data?.statuses}
            onFilterChange={onFilterChange}
            // serviceRequestIdKey={isFstpOperator ? t("ES_INBOX_VEHICLE_LOG") : DSO ? t("ES_INBOX_APPLICATION_NO") : t("ES_INBOX_APPLICATION_NO")}
            // isFstpOperator={isFstpOperator}
            isLoading={isLoading}
            // isSearch={isSearch}
            onSearch={onSearch}
            onSort={onSort}
            searchParams={searchParams}
            searchFields={searchFields}
            // linkPrefix={linkPrefix}
            // removeParam={removeParam}
            sortParams={sortParams}
          />
        </div>
      </div>
    </div>
  )
}

export default MobileInbox;
