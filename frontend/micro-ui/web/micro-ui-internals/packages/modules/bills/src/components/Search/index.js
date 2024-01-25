import { Loader, Card, Header, SearchForm, Table, DownloadIcon, MultiLink, DownloadBtnCommon } from "@egovernments/digit-ui-react-components";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { getActionButton, getBillNumber } from "../../utils";
import { Link } from "react-router-dom";
import SearchFields from "./SearchFields";
import MobileSearchApplication from "./MobileSearchApplication";

const SearchApplication = ({ showTable, showLoader, isLoading, tenantId, t, onSubmit, data, count, success }) => {
  const initialValues = Digit.SessionStorage.get("BILLS_SEARCH_APPLICATION_DETAIL") || {
    offset: 0,
    limit: 10,
    sortBy: "commencementDate",
    sortOrder: "DESC",
  };
  const { register, control, handleSubmit, setValue, getValues, reset, formState } = useForm({
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
  const [tabledata, settabledata] = useState([]);
  const DownloadBtn = (props) => {
    return (
      <div onClick={props.onClick}>
        <DownloadBtnCommon />
      </div>
    );
  };
  const handleExcelDownload = (tabData) => {
    if (tabData?.[0] !== undefined) {
      return Digit.Download.Excel(tabData?.[0], "Bills");
    }
  };
  useEffect(() => {
    register("offset", 0);
    register("limit", 10);
    register("sortBy", "commencementDate");
    register("sortOrder", "DESC");
  }, [register]);
  useEffect(() => {
    if (data?.length > 0) {
      settabledata([
        data?.map((obj) => {
          let returnObject = {};
          returnObject[t("ABG_COMMON_TABLE_COL_BILL_NO")] = obj?.billNumber;
          returnObject[t("ABG_COMMON_TABLE_COL_CONSUMER_NAME")] = obj?.payerName;
          returnObject[t("ABG_COMMON_TABLE_COL_BILL_DATE")] = convertEpochToDate(obj?.billDate);
          returnObject[t("ABG_COMMON_TABLE_COL_BILL_AMOUNT")] = obj?.totalAmount;
          returnObject[t("ABG_COMMON_TABLE_COL_STATUS")] = obj?.status;
          return {
            ...returnObject,
          };
        }),
      ]);
    }
  }, [data]);
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
    return (
      <MobileSearchApplication
        {...{ showTable, showLoader, isLoading, Controller, register, control, t, reset, previousPage, handleSubmit, tenantId, data, onSubmit }}
      />
    );
  }
  //need to get from workflow
  const GetCell = (value) => <span className="cell-text">{value}</span>;
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
        },
      },
      {
        Header: t("ABG_COMMON_TABLE_COL_BILL_DATE"),
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
        disableSortBy: true,
        Cell: ({ row }) => {
          const amount = row.original?.totalAmount;
          if (amount > 0) {
            return GetCell(getActionItem(row.original?.status, row));
          } else {
            return GetCell(t(`${"CS_NA"}`));
          }
        },
      },
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
                  pathname: `/digit-ui/employee/payment/collect/${row.original?.["businessService"]}/${
                    row.original?.["consumerCode"]?.includes("WS") || row.original?.["consumerCode"]?.includes("SW")
                      ? encodeURIComponent(row.original?.["consumerCode"], "/", "+")
                      : row.original?.["consumerCode"]
                  }/tenantId=${row.original?.["tenantId"]}?workflow=${
                    row.original?.["consumerCode"]?.includes("WS") || row.original?.["consumerCode"]?.includes("SW") ? "WS" : "mcollect"
                  }`,
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
                  pathname: `/digit-ui/employee/payment/collect/${row.original?.["businessService"]}/${
                    row.original?.["consumerCode"]?.includes("WS") || row.original?.["consumerCode"]?.includes("SW")
                      ? encodeURIComponent(row.original?.["consumerCode"], "/", "+")
                      : row.original?.["consumerCode"]
                  }/tenantId=${row.original?.["tenantId"]}?workflow=${
                    row.original?.["consumerCode"]?.includes("WS") || row.original?.["consumerCode"]?.includes("SW") ? "WS" : "mcollect"
                  }`,
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
      <Card className={"card-search-heading"}>
        <span style={{ color: "#505A5F" }}>{t("WS_INFO_VALIDATION")}</span>
      </Card>
      <SearchForm className="ws-custom-wrapper" onSubmit={onSubmit} handleSubmit={handleSubmit}>
        <SearchFields {...{ register, control, reset, tenantId, t, previousPage, formState }} />
      </SearchForm>
      {isLoading && <Loader />}
      {data && data?.length == 0 ? (
        <Card style={{ backgroundColor: "white", textAlign: "center" }}>{t("ES_COMMON_NO_DATA")}</Card>
      ) : (
        success &&
        data &&
        data.length > 0 && (
          <div style={{ backgroundColor: "white" }}>
            <div className="sideContent" style={{ float: "left", padding: "20px 10px", fontSize: "24px", fontWeight: "700", fontFamily: "Roboto" }}>
              {t("ABG_SEARCH_RESULTS_HEADER")}
            </div>
            <div className="sideContent" style={{ float: "right", padding: "10px 30px" }}>
              <span className="table-search-wrapper">
                <DownloadBtn className="mrlg cursorPointer" onClick={() => handleExcelDownload(tabledata)} />
              </span>
            </div>
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
              manualPagination={false}
              onPrevPage={previousPage}
              pageSizeLimit={getValues("limit")}
              onSort={onSort}
              disableSort={false}
              sortParams={[{ id: getValues("sortBy"), desc: getValues("sortOrder") === "DESC" ? true : false }]}
            />
          </div>
        )
      )}
    </React.Fragment>
  );
};

export default SearchApplication;
