import { Card, Loader } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import InboxLinks from "./ApplicationLinks";
import ApplicationTable from "./ApplicationTable";
import SearchApplication from "./search";

const ReceiptsDesktopInbox = ({ tableConfig, filterComponent, ...props }) => {
  const { t } = useTranslation();
  const tenantIds = Digit.SessionStorage.get("HRMS_TENANTS");
  const GetCell = (value) => <span className="cell-text">{t(value)}</span>;
  const GetDateCell = (value) => {
    const date = new Date(value);
    return <span className="cell-text">{date?.toLocaleDateString()}</span>
  };
  const GetSlaCell = (value, t, prefix = '') => {
    return value == "CANCELLED" ? <span className="sla-cell-error">{t(`${prefix}${value}`) || ""}</span> : <span className="sla-cell-success">{t(`${prefix}${value}`) || ""}</span>;
  };
  const data = props?.data?.Payments;
  const [FilterComponent, setComp] = useState(() => Digit.ComponentRegistryService?.getComponent(filterComponent));
  const columns = React.useMemo(() => {
    return [
      {
        Header: t("CR_COMMON_TABLE_COL_RECEIPT_NO"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return (
            <span className="link">
              <Link to={`/digit-ui/employee/receipts/details/${row.original?.paymentDetails[0]?.businessService}/${encodeURIComponent(row.original?.paymentDetails[0]?.receiptNumber)}`}>{row.original?.paymentDetails[0]?.receiptNumber}</Link>
            </span>
          );
        },
      },
      {
        Header: t("CR_COMMON_TABLE_COL_DATE"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetDateCell(row.original?.transactionDate);
        },
      },
      {
        Header: t("CR_COMMON_TABLE_CONSUMERCODE"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.paymentDetails[0]?.bill?.consumerCode}`);
        },
      },
      {
        Header: t("CR_COMMON_TABLE_COL_PAYEE_NAME"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.payerName}`);
        },
      },
      {
        Header: t("CR_SERVICE_TYPE_LABEL"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${t("BILLINGSERVICE_BUSINESSSERVICE_" + row.original?.paymentDetails[0]?.businessService)}`);
        },
      },
      {
        Header: t("CR_COMMON_TABLE_COL_STATUS"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetSlaCell(`${row.original?.paymentStatus}`, t, 'RC_');
        },
      },

    ];
  }, []);

  let result;
  if (props.isLoading) {
    result = <Loader />;
  } else if (data?.length === 0) {
    result = (
      <Card style={{ marginTop: 20 }}>
        {t("CS_MYAPPLICATIONS_NO_APPLICATION")
          .split("\\n")
          .map((text, index) => (
            <p key={index} style={{ textAlign: "center" }}>
              {text}
            </p>
          ))}
      </Card>
    );
  } else if (data?.length > 0) {
    result = (
      <ApplicationTable
        t={t}
        data={data}
        columns={columns}
        getCellProps={(cellInfo) => {
          return {
            style: {
              maxWidth: cellInfo.column.Header === t("HR_EMP_ID_LABEL") ? "140px" : "",
              padding: "20px 18px",
              fontSize: "16px",
            },
          };
        }}
        onPageSizeChange={props.onPageSizeChange}
        currentPage={props.currentPage}
        onNextPage={props.onNextPage}
        onPrevPage={props.onPrevPage}
        onLastPage={props.onLastPage}
        onFirstPage={props.onFirstPage}
        pageSizeLimit={props.pageSizeLimit}
        onSort={props.onSort}
        disableSort={props.disableSort}
        onPageSizeChange={props.onPageSizeChange}
        sortParams={props.sortParams}
        totalRecords={props.totalRecords}
      />
    );
  }

  return (
    <div className="inbox-container">
      {!props.isSearch && (
        <div className="filters-container">
          <InboxLinks
            parentRoute={props.parentRoute}
            allLinks={[
              {
                text: "CR_COMMON_DASHBOARD_HEADER",
                link: "/digit-ui/employee/receipts/inprogress",
                businessService: "receipts",
                roles: ["CR_PT"],
              },
              {
                text: "CR_COMMON_REPORTS_HEADER",
                link: "/digit-ui/employee/receipts/inprogress",
                businessService: "receipts",
                roles: ["CR_PT"],
              }
            ]}
            headerText={t("ACTION_TEST_RECEIPTS")}
            businessService={props.businessService}
          />
          <div>
            {
              <FilterComponent
                defaultSearchParams={props.defaultSearchParams}
                onFilterChange={props.onFilterChange}
                searchParams={props.searchParams}
                type="desktop"
                tenantIds={tenantIds}
              />
            }
          </div>
        </div>
      )}
      <div style={{ flex: 1 }}>
        <SearchApplication
          defaultSearchParams={props.defaultSearchParams}
          onSearch={props.onSearch}
          type="desktop"
          tenantIds={tenantIds}
          searchFields={props.searchFields}
          isInboxPage={!props?.isSearch}
          searchParams={props.searchParams}
        />
        <div className="result" style={{ marginLeft: !props?.isSearch ? "24px" : "", flex: 1 }}>
          {result}
        </div>
      </div>
    </div>
  );
};

export default ReceiptsDesktopInbox;
