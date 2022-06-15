import { Card, Header, SearchForm, Table } from "@egovernments/digit-ui-react-components";
import React, { useCallback, useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { getActionButton, getBillNumber } from "../../utils";
import { Link } from "react-router-dom";
import MobileSearchApplication from "./MobileSearchApplication";
import SearchFields from "./SearchFields";

const SearchApplication = ({ tenantId, t, onSubmit, data, count }) => {
  const initialValues = Digit.SessionStorage.get("BILLS_SEARCH_APPLICATION_DETAIL") || {
    offset: 0,
    limit: 10,
    sortBy: "commencementDate",
    sortOrder: "DESC",
  };
  const { register, control, handleSubmit, setValue, getValues, reset } = useForm({
    defaultValues: initialValues,
  });
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

  useEffect(() => {
    register("offset", 0);
    register("limit", 10);
    register("sortBy", "commencementDate");
    register("sortOrder", "DESC");
  }, [register]);

  const onSort = useCallback((args) => {
    if (args.length === 0) return;
    setValue("sortBy", args.id);
    setValue("sortOrder", args.desc ? "DESC" : "ASC");
  }, []);

  function onPageSizeChange(e) {
    setValue("limit", Number(e.target.value));
    handleSubmit(onSubmit)();
  }

  function nextPage() {
    setValue("offset", getValues("offset") + getValues("limit"));
    handleSubmit(onSubmit)();
  }
  function previousPage() {
    setValue("offset", getValues("offset") - getValues("limit"));
    handleSubmit(onSubmit)();
  }

  const isMobile = window.Digit.Utils.browser.isMobile();

  if (isMobile) {
    return <MobileSearchApplication {...{ Controller, register, control, t, reset, previousPage, handleSubmit, tenantId, data, onSubmit }} />;
  }

  //need to get from workflow
  const GetCell = (value) => <span className="cell-text">{value}</span>;
  <header>keerthi</header>
  const columns = useMemo(
    () => [
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
        },      },
      {
        Header: t("ABG_COMMON_TABLE_COL_BILL_DATE"),
        disableSortBy: true,
        Cell: ({ row }) => {
          const billDate = row.original?.billDate === "NA" ? t("CS_NA") : convertEpochToDate(row.original?.billDate);
          return GetCell(t(`${billDate}`));
        },      },
      {
        Header: t("ABG_COMMON_TABLE_COL_BILL_AMOUNT"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.["totalAmount"]}`);
        },      },
      {
        Header: t("ABG_COMMON_TABLE_COL_STATUS"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.["status"]}`);
        },      },
      {
        Header: t("ABG_COMMON_TABLE_COL_ACTION"),
        disableSortBy: true,
        Cell: ({ row }) => {
          const amount = row.original?.totalAmount;
          if (amount > 0) {
            return GetCell(getActionItem(row.original?.status, row));
          } else {
            return GetCell(t(`${"CS_NA"}`));
          }
        },
      }
    ],
    []
  );
  const getActionItem = (status, row) => {
    if (window.location.href.includes("/digit-ui/employee/bills/group-bill")) {
      return null;
    }
    switch (status) {
      case "ACTIVE":
        return (
          <div>
            <span className="link">
              <Link
                to={{
                  pathname: `/digit-ui/employee/payment/collect/${row.original?.["businessService"]}/${row.original?.["consumerCode"]}/tenantId=${row.original?.["tenantId"]}?workflow=mcollect`,
                }}
              >
                {t(`${"ABG_COLLECT"}`)}{" "}
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
                  pathname: `/digit-ui/employee/payment/collect/${row.original?.["businessService"]}/${row.original?.["consumerCode"]}/tenantId=${row.original?.["tenantId"]}?workflow=mcollect`,
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
  return (
    <React.Fragment>
      <Header>{t("ABG_SEARCH_BILL_COMMON_HEADER")}</Header>
      <SearchForm onSubmit={onSubmit} handleSubmit={handleSubmit}>
        <SearchFields {...{ register, control, reset, tenantId, t, previousPage }} />
      </SearchForm>
      {data?.display ? (
        <Card style={{ marginTop: 20 }}>
          {t(data.display)
            .split("\\n")
            .map((text, index) => (
              <p key={index} style={{ textAlign: "center" }}>
                {text}
              </p>
            ))}
        </Card>
      ) : (
        data !== "" && (
          <Table
            t={t}
            data={data}
            totalRecords={count}
            columns={columns}
            getCellProps={(cellInfo) => {
              return {
                style: {
                  minWidth: cellInfo.column.Header === t("ES_INBOX_APPLICATION_NO") ? "240px" : "",
                  padding: "20px 18px",
                  fontSize: "16px",
                },
              };
            }}
            onPageSizeChange={onPageSizeChange}
            currentPage={getValues("offset") / getValues("limit")}
            onNextPage={nextPage}
            onPrevPage={previousPage}
            pageSizeLimit={getValues("limit")}
            onSort={onSort}
            disableSort={false}
            sortParams={[{ id: getValues("sortBy"), desc: getValues("sortOrder") === "DESC" ? true : false }]}
          />
        )
      )}
    </React.Fragment>
  );
};

export default SearchApplication;
