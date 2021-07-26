import React from "react";
import { useTranslation } from "react-i18next";
import { ApplicationCard } from "./ApplicationCard";

const GetDateCell = (value) => {
  const date = new Date(value);
  return <span className="sla-cell">{date?.toLocaleDateString()}</span>
};
const GetCell = (value) => <span className="sla-cell">{value}</span>;

const ReceiptsMobileInbox = ({
  data,
  isLoading,
  isSearch,
  searchFields,
  onFilterChange,
  onSearch,
  onSort,
  parentRoute,
  searchParams,
  sortParams,
  linkPrefix,
  tableConfig,
  filterComponent,
  allLinks,
  defaultSearchParams
}) => {
  
  const { t } = useTranslation();
  const getData = () => {
    return data?.Payments?.map((original) => ({
      [t("CR_COMMON_TABLE_COL_RECEIPT_NO")]: original?.paymentDetails[0]?.receiptNumber,
      [t("CR_COMMON_TABLE_COL_DATE")]: GetDateCell(original?.transactionDate || ""),
      [t("CR_COMMON_TABLE_CONSUMERCODE")]: GetCell(original?.paymentDetails[0]?.bill?.consumerCode || ""),
      [t("CR_COMMON_TABLE_COL_PAYEE_NAME")]: GetCell(original?.payerName),
      [t("CR_SERVICE_TYPE_LABEL")]: GetCell(t(`BILLINGSERVICE_BUSINESSSERVICE_${original?.paymentDetails[0]?.businessService}`)),
      [t("CR_COMMON_TABLE_COL_STATUS")]: GetCell(t(`RC_${original?.paymentStatus}`)),
    }));
  };
  const serviceRequestIdKey = (original) => {return `${searchParams?.businessServices}/${encodeURIComponent(original?.[t("CR_COMMON_TABLE_COL_RECEIPT_NO")])}`};
  return (
    <div style={{ padding: 0 }}>
      <div className="inbox-container">
        <div className="filters-container">
          {/* {!isSearch && <ApplicationLinks linkPrefix={parentRoute} allLinks={allLinks} isMobile={true} />} */}
          <ApplicationCard
            t={t}
            data={getData()}
            onFilterChange={onFilterChange}
            isLoading={isLoading}
            isSearch={isSearch}
            onSearch={onSearch}
            onSort={onSort}
            defaultSearchParams={defaultSearchParams}
            searchParams={searchParams}
            searchFields={searchFields}
            linkPrefix={linkPrefix}
            sortParams={sortParams}
            filterComponent={filterComponent}
            serviceRequestIdKey={serviceRequestIdKey}
          />
        </div>
      </div>
    </div>
  );
};

export default ReceiptsMobileInbox;
