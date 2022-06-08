import { Card, Loader } from "@egovernments/digit-ui-react-components";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { getActionButton, getBillNumber } from "../../utils";
import InboxLinks from "../inbox/ApplicationLinks";
import ApplicationTable from "../inbox/ApplicationTable";
import SearchCitizen from "./SearchCitizen";

const CitizenInbox = ({ tableConfig, filterComponent, ...props }) => {
  const { t } = useTranslation();
  const tenantIds = Digit.SessionStorage.get("HRMS_TENANTS");
  const data = props?.data?.Bills;
  const [FilterComponent, setComp] = useState(() => Digit.ComponentRegistryService?.getComponent(filterComponent));
  const GetCell = (value) => <span className="cell-text">{value}</span>;

  const convertEpochToDate = (dateEpoch) => {
    if (dateEpoch == null || dateEpoch == undefined || dateEpoch == "") {
      return "NA";
    }
    const dateFromApi = new Date(dateEpoch);
    let month = dateFromApi.getMonth() + 1;
    let day = dateFromApi.getDate();
    let year = dateFromApi.getFullYear();
    month = (month > 9 ? "" : "0") + month;
    day = (day > 9 ? "" : "0") + day;
    return `${day}/${month}/${year}`;
  };

  const columns = React.useMemo(() => {
    return [
      {
        Header: t("ABG_COMMON_TABLE_COL_BILL_NO"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return (
            <div>
              <span className="link">
                {GetCell(getBillNumber(row.original?.businessService, row.original?.consumerCode, row.original?.billNumber))}
              </span>
            </div>
          );
        },
      },
      {
        Header: t("ABG_COMMON_TABLE_COL_CONSUMER_NAME"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.["payerName"]}`);
        },
      },
      {
        Header: t("ABG_COMMON_TABLE_COL_BILL_EXP_DATE"),
        disableSortBy: true,
        Cell: ({ row }) => {
          const billDate = row.original?.billDate === "NA" ? t("CS_NA") : convertEpochToDate(row.original?.billDate);
          return GetCell(t(`${billDate}`));
        },
      },
      {
        Header: t("ABG_COMMON_TABLE_COL_BILL_AMOUNT"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.["totalAmount"]}`);
        },
      },

      {
        Header: t("ABG_COMMON_TABLE_COL_STATUS"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.["status"]}`);
        },
      },
      {
        Header: t("ABG_COMMON_TABLE_COL_ACTION"),
        Cell: ({ row }) => {
          const amount = row.original?.totalAmount;
          if (amount > 0) {
            return GetCell(getActionItem(row.original?.status, row));
          } else {
            return GetCell(t(`${"CS_NA"}`));
          }
        },
      },
    ];
  }, []);

  const getActionItem = (status, row) => {
    switch (status) {
      case "ACTIVE":
        return (
          <div>
            <span className="link">
              <Link
                to={{
                  pathname: `/digit-ui/citizen/payment/my-bills/${row.original?.["businessService"]}/${row.original?.["consumerCode"]}/tenantId=${row.original?.["tenantId"]}?workflow=mcollect`,
                }}
              >
                {t(`${"ABG_PAY"}`)}
              </Link>
            </span>
          </div>
        );
      case "CANCELLED":
      case "EXPIRED":
        return (
          <div>
            <span className="link">
              <Link
                to={{
                  pathname: `/digit-ui/citizen/payment/my-bills/${row.original?.["businessService"]}/${row.original?.["consumerCode"]}/tenantId=${row.original?.["tenantId"]}?workflow=mcollect`,
                }}
              >
                {t(`${"ABG_GENERATE_NEW_BILL"}`)}
              </Link>
            </span>
          </div>
        );
      case "PAID":
        return (
          <div>
            <span className="link">{getActionButton(row.original?.["businessService"], row.original?.["consumerCode"])}</span>
          </div>
        );
    }
  };

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
        sortParams={props.sortParams}
        totalRecords={props.totalRecords}
      />
    );
  }

  return (
    <div className="inbox-container">
      {!props.isSearch && (
        <div className="filters-container">
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
        <SearchCitizen
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

export default CitizenInbox;
