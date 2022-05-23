import React from "react";
import { useTranslation } from "react-i18next";
import { ApplicationCard } from "./ApplicationCard";

const GetDateCell = (value) => {
  const date = new Date(value);
  return <span className="sla-cell">{date?.toLocaleDateString()}</span>;
};
const GetCell = (value) => <span className="sla-cell">{value}</span>;

const BillsMobileInbox = ({
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
  defaultSearchParams,
}) => {
  const { t } = useTranslation();
  const getData = () => {
    return data?.Bills?.map((original) => ({
      [t("ABG_COMMON_TABLE_COL_BILL_NO")]: GetCell(original?.billNumber),
      [t("ABG_COMMON_TABLE_COL_CONSUMER_NAME")]: GetCell(original?.payerName),
      [t("ABG_COMMON_TABLE_COL_BILL_EXP_DATE")]: GetDateCell(original?.billDate),
      [t("ABG_COMMON_TABLE_COL_BILL_AMOUNT")]: GetCell(original?.totalAmount),
      [t("ABG_COMMON_TABLE_COL_STATUS")]: GetCell(original?.status),
    }));
  };
  const serviceRequestIdKey = (original) => {
    return `${searchParams?.businessServices}/${encodeURIComponent(original?.[t("CR_COMMON_TABLE_COL_RECEIPT_NO")])}`;
  };
  return (
    <div style={{ padding: 0 }}>
      <div className="inbox-container">
        <div className="filters-container">
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

export default BillsMobileInbox;
