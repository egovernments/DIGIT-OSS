import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { printRecieptMobile } from "../../utils";
import ApplicationCitizenCard from "./ApplicationCitizenCard";
const GetDateCell = (value) => {
  const date = new Date(value);
  return <span className="sla-cell">{date?.toLocaleDateString()}</span>;
};
const GetCell = (value) => <span className="sla-cell">{value}</span>;

const CitizenMobileInbox = ({
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
      [t("ABG_COMMON_TABLE_COL_ACTION")]: GetActioncell(original),
    }));
  };

  const GetActioncell = (original) => {
    if (original?.totalAmount > 0) {
      if (original?.status === "ACTIVE") {
        return (
          <div>
            <span className="link">
              <Link
                to={{
                  pathname: `/digit-ui/citizen/payment/collect/${original?.["businessService"]}/${original?.["consumerCode"]}/tenantId=${original?.["tenantId"]}`,
                }}
              >
                {t(`${"ABG_PAY"}`)}
              </Link>
            </span>
          </div>
        );
      } else if (original?.status === "CANCELLED" || original?.status === "EXPIRED") {
        return (
          <div>
            <span className="link">
              <Link
                to={{
                  pathname: `/digit-ui/citizen/payment/collect/${original?.["businessService"]}/${original?.["consumerCode"]}/tenantId=${original?.["tenantId"]}`,
                }}
              >
                {t(`${"ABG_GENERATE_NEW_BILL"}`)}
              </Link>
            </span>
          </div>
        );
      } else if (original?.status === "PAID") {
        return (
          <div>
            <span className="link">
              <Link>
                <a
                  href="javascript:void(0)"
                  style={{
                    color: "#FE7A51",
                    cursor: "pointer",
                  }}
                  onClick={(value) => {
                    printRecieptMobile(original?.["businessService"], original?.["consumerCode"]);
                  }}
                >
                  {" "}
                  {t(`${"ABG_DOWNLOAD_RECEIPT"}`)}{" "}
                </a>
              </Link>
            </span>
          </div>
        );
      }
    } else {
      return GetCell(t(`${"CS_NA"}`));
    }
  };

  const serviceRequestIdKey = (original) => {
    return `${searchParams?.businessServices}/${encodeURIComponent(original?.[t("CR_COMMON_TABLE_COL_RECEIPT_NO")])}`;
  };
  return (
    <div style={{ padding: 0 }}>
      <div className="inbox-container">
        <div className="filters-container">
          <ApplicationCitizenCard
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

export default CitizenMobileInbox;
