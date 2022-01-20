import React from "react";
import ApplicationCard from "./ApplicationCard";

const MobileInbox = ({ data, edcrData = [], t, statusMap, bparegData, title, iconName, links, searchFields, searchParams, onFilterChange, sortParams, onSearch, onSort, isLoading }) => {

  const getData = () => {
    return data?.table?.concat(edcrData, bparegData).map(row => {
      if (row?.edcrNumber) {
        return {
          [t('BPA_COMMON_APP_NO')]: row?.applicationNumber,
          [t('BPA_BASIC_DETAILS_APPLICATION_TYPE_LABEL')]: row?.appliactionType,
          [t('BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL')]: row?.applicationSubType,
          [t('BPA_BASIC_DETAILS_APPLICATION_NAME_LABEL')]: row?.planDetail?.planInformation?.applicantName,
          [t('TL_COMMON_TABLE_COL_STATUS')]: row?.state ? t(`WF_BPA_${row?.state}`): t(`WF_BPA_${row?.status}`),
          [t('BPA_COMMON_SLA')]: t(`OBPS_NOT_APPLICAPABLE`),
        }
      }
      return {
        [t('BPA_COMMON_APP_NO')]: row?.applicationId,
        [t('BPA_BASIC_DETAILS_APPLICATION_TYPE_LABEL')]: row?.applicationType && t(row?.applicationType) || t(`OBPS_NOT_APPLICAPABLE`),
        [t('BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL')]: row?.serviceType && t(row?.serviceType ) || t(`OBPS_NOT_APPLICAPABLE`),
        [t('BPA_BASIC_DETAILS_APPLICATION_NAME_LABEL')]: row?.applicantName,
        [t('TL_COMMON_TABLE_COL_STATUS')]: row?.status&& t(`WF_BPA_${row?.status}`),
        [t('BPA_COMMON_SLA')]: row?.sla,
        "serviceType":{value:row?.businessService,hidden:true}
      }
    })
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
            idKey={t('BPA_COMMON_APP_NO')}
            statusMap={statusMap}
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
