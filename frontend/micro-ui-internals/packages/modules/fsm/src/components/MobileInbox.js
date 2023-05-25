import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ApplicationCard } from "./inbox/ApplicationCard";
import ApplicationLinks from "./inbox/ApplicationLinks";

const GetSlaCell = (value) => {
  if (isNaN(value)) return <span className="sla-cell-success">0</span>;
  return value < 0 ? <span className="sla-cell-error">{value}</span> : <span className="sla-cell-success">{value}</span>;
};

const GetCell = (value) => <span className="sla-cell">{value}</span>;

const MobileInbox = ({
  data,
  vehicleLog,
  isLoading,
  isSearch,
  onSearch,
  onFilterChange,
  onSort,
  searchParams,
  searchFields,
  linkPrefix,
  parentRoute,
  removeParam,
  sortParams,
}) => {
  const { t } = useTranslation();
  const getData = () => {
    if (isSearch) {
      return data?.map(({ applicationNo, applicationStatus, propertyUsage, tenantId, address, citizen }) => ({
        [t("ES_INBOX_APPLICATION_NO")]: applicationNo,
        [t("ES_APPLICATION_DETAILS_APPLICANT_NAME")]: GetCell(citizen?.name || ""),
        [t("ES_APPLICATION_DETAILS_APPLICANT_MOBILE_NO")]: GetCell(citizen?.mobileNumber || ""),
        [t("ES_APPLICATION_DETAILS_PROPERTY_TYPE")]: GetCell(t(`PROPERTYTYPE_MASTERS_${propertyUsage.split(".")[0]}`)),
        [t("ES_APPLICATION_DETAILS_PROPERTY_SUB-TYPE")]: GetCell(t(`PROPERTYTYPE_MASTERS_${propertyUsage}`)),
        [t("ES_INBOX_LOCALITY")]: GetCell(t(Digit.Utils.locale.getRevenueLocalityCode(address.locality.code, tenantId))),
        [t("ES_INBOX_STATUS")]: GetCell(t(`CS_COMMON_FSM_${applicationStatus}`)),
      }));
    } else {
      return data?.map(({ locality, applicationNo, createdTime, tenantId, status, sla }) => ({
        [t("ES_INBOX_APPLICATION_NO")]: applicationNo,
        [t("ES_INBOX_APPLICATION_DATE")]: `${createdTime.getDate()}/${createdTime.getMonth() + 1}/${createdTime.getFullYear()}`,
        [t("ES_INBOX_LOCALITY")]: GetCell(t(Digit.Utils.locale.getRevenueLocalityCode(locality, tenantId))),
        [t("ES_INBOX_STATUS")]: GetCell(t(`CS_COMMON_${status}`)),
        [t("ES_INBOX_SLA_DAYS_REMAINING")]: GetSlaCell(sla),
      }));
    }
  };

  const DSO = Digit.UserService.hasAccess(["FSM_DSO"]) || false;

  const isFstpOperator = Digit.UserService.hasAccess("FSM_EMP_FSTPO") || false;

  const fstpOperatorData = vehicleLog?.map((vehicle) => ({
    [t("ES_INBOX_VEHICLE_LOG")]: vehicle?.applicationNo,
    [t("ES_INBOX_VEHICLE_NO")]: vehicle?.vehicle?.registrationNumber,
    [t("ES_INBOX_DSO_NAME")]: vehicle?.tripOwner.displayName,
    [t("ES_INBOX_WASTE_COLLECTED")]: vehicle?.tripDetails[0]?.volume,
  }));

  return (
    <div style={{ padding: 0 }}>
      <div className="inbox-container">
        <div className="filters-container">
          {!isFstpOperator && !isSearch && <ApplicationLinks linkPrefix={parentRoute} isMobile={true} />}
          <ApplicationCard
            t={t}
            data={isFstpOperator ? fstpOperatorData : getData()}
            onFilterChange={!isFstpOperator ? onFilterChange : false}
            serviceRequestIdKey={isFstpOperator ? t("ES_INBOX_VEHICLE_LOG") : DSO ? t("ES_INBOX_APPLICATION_NO") : t("ES_INBOX_APPLICATION_NO")}
            isFstpOperator={isFstpOperator}
            isLoading={isLoading}
            isSearch={isSearch}
            onSearch={onSearch}
            onSort={onSort}
            searchParams={searchParams}
            searchFields={searchFields}
            linkPrefix={linkPrefix}
            removeParam={removeParam}
            sortParams={sortParams}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileInbox;
