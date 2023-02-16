import React, { Fragment, useEffect, useCallback, useMemo } from "react";
import { SearchForm, Table, Card, Loader, Header } from "@egovernments/digit-ui-react-components";
import { useForm, Controller } from "react-hook-form";
import SearchFields from "./SearchFields";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import MobileSearchApplication from "./MobileSearchApplication";
const SearchApplication = ({ tenantId, onSubmit, data, count, resultOk, businessService, isLoading }) => {
  
  const [sessionFormData, setSessionFormData, clearSessionFormData] = Digit.Hooks.useSessionStorage("ADHOC_ADD_REBATE_DATA", {});
  const [sessionBillFormData, setSessionBillFormData, clearBillSessionFormData] = Digit.Hooks.useSessionStorage("ADHOC_BILL_ADD_REBATE_DATA", {});
  
  const replaceUnderscore = (str) => {
    str = str.replace(/_/g, " ");
    return str;
  };

  const { t } = useTranslation();
  const { register, control, handleSubmit, setValue, getValues, reset } = useForm({
    defaultValues: {
      offset: 0,
      limit: 10,
      sortBy: "commencementDate",
      sortOrder: "DESC",
      isConnectionSearch: true,
    },
  });

  useEffect(() => {
    register("offset", 0);
    register("limit", 10);
    register("sortBy", "commencementDate");
    register("sortOrder", "DESC");
    register("sortOrder", "DESC");
    register("isConnectionSearch", true);
  }, [register]);

  useEffect(() => {
    clearSessionFormData();
    setSessionFormData({});
    setSessionBillFormData({});
    clearBillSessionFormData()
  }, []);

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
    return <MobileSearchApplication {...{ Controller, register, control, t, reset, previousPage, handleSubmit, tenantId, data, onSubmit, businessService }} />;
  }

  //need to get from workflow
  const GetCell = (value) => <span className="cell-text">{value}</span>;
  const columns = useMemo(
    () => [
      {
        Header: t("WS_MYCONNECTIONS_CONSUMER_NO"),
        disableSortBy: true,
        accessor: "connectionNo",
        Cell: ({ row }) => {
          let service = "WATER";
            if (
              row?.original?.["applicationType"] == "NEW_WATER_CONNECTION" || 
              row?.original?.["applicationType"] == "MODIFY_WATER_CONNECTION" ||
              row?.original?.["applicationType"] == "DISCONNECT_WATER_CONNECTION"
            ) {
              service = "WATER"
            } else if (
              row?.original?.["applicationType"] == "NEW_SEWERAGE_CONNECTION" ||
              row?.original?.["applicationType"] == "MODIFY_SEWERAGE_CONNECTION" || 
              row?.original?.["applicationType"] == "DISCONNECT_SEWERAGE_CONNECTION"
            ) {
              service = "SEWERAGE"
            }
          
          return (
            <div>
              {row.original["connectionNo"] ? (
                <span className={"link"}>
                  <Link
                    to={`/digit-ui/employee/ws/connection-details?applicationNumber=${
                      row.original["connectionNo"]
                      }&tenantId=${tenantId}&service=${service}&due=${row.original?.due || 0}&from=WS_SEWERAGE_APPLICATION_SEARCH`}
                  >
                    {row.original["connectionNo"] || "NA"}
                  </Link>
                </span>
              ) : (
                <span>{t("NA")}</span>
              )}
            </div>
          );
        },
      },
      {
        Header: t("WS_ACK_COMMON_APP_NO_LABEL"),
        accessor: "applicationNo",
        disableSortBy: true,
        Cell: ({ row }) => {
          let service = "WATER";
          if (
            row?.original?.["applicationType"] == "NEW_WATER_CONNECTION" || 
            row?.original?.["applicationType"] == "MODIFY_WATER_CONNECTION" ||
            row?.original?.["applicationType"] == "DISCONNECT_WATER_CONNECTION"
          ) {
            service = "WATER"
          } else if (
            row?.original?.["applicationType"] == "NEW_SEWERAGE_CONNECTION" ||
            row?.original?.["applicationType"] == "MODIFY_SEWERAGE_CONNECTION" || 
            row?.original?.["applicationType"] == "DISCONNECT_SEWERAGE_CONNECTION"
          ) {
            service = "SEWERAGE"
          }
        
          if (row.original["applicationType"] === "MODIFY_SEWERAGE_CONNECTION" || row.original["applicationType"] === "MODIFY_WATER_CONNECTION") {
            let application = "application";
            if (row?.original?.["applicationType"]?.toUpperCase()?.includes("DISCONNECT")) {
              application = "disconnection";
            } else if (row?.original?.["applicationType"]?.toUpperCase()?.includes("MODIFY")) {
              application = "modify";
            }
            return (
              <div>
                <span className="link">
                  <Link
                    to={`/digit-ui/employee/ws/${application}-details?applicationNumber=${
                      row.original["applicationNo"]
                      }&tenantId=${tenantId}&service=${service}&mode=${"MODIFY"}&from=WS_SEWERAGE_APPLICATION_SEARCH`}
                  >
                    {row.original["applicationNo"]}
                  </Link>
                </span>
              </div>
            );
          } else {
            let application = "application";
            if (row?.original?.["applicationType"]?.includes("DISCONNECT")) {
              application = "disconnection";
            } else if (row?.original?.["applicationType"]?.includes("MODIFY")) {
              application = "modify";
            }
            return (
              <div>
                <span className="link">
                  <Link
                    to={`/digit-ui/employee/ws/${application}-details?applicationNumber=${row.original["applicationNo"]}&tenantId=${tenantId}&service=${service}&from=WS_SEWERAGE_APPLICATION_SEARCH`}
                  >
                    {row.original["applicationNo"]}
                  </Link>
                </span>
              </div>
            );
          }
        },
      },
      {
        Header: t("WS_APPLICATION_TYPE_LABEL"),
        disableSortBy: true,
        accessor: (row) => {
          return GetCell(t(`WS_${row.applicationType}`))
        },
      },
      {
        Header: t("WS_COMMON_TABLE_COL_OWN_NAME_LABEL"),
        disableSortBy: true,
        accessor: (row) => {
          return GetCell(row?.connectionHolders?.[0]?.name ? row?.connectionHolders?.[0]?.name : row?.ownerNames || "-");
        },
      },
      {
        Header: t("WS_COMMON_TABLE_COL_APPLICATION_STATUS_LABEL"),
        accessor: (row) => GetCell(t(row?.applicationStatus || "NA")),
        disableSortBy: true,
      },
      {
        Header: t("WS_COMMON_TABLE_COL_ADDRESS"),
        disableSortBy: true,
        accessor: (row) => GetCell(row?.address || "-"),
      },
    ],
    []
  );
  
  return (
    <>
      <Header styles={{ fontSize: "32px" }}>{businessService === "WS" ? t("WS_WATER_SEARCH_APPLICATION_SUB_HEADER") : t("WS_SEWERAGE_SEARCH_APPLICATION_SUB_HEADER")}</Header>
      < Card className={"card-search-heading"}>
        <span style={{ color: "#505A5F" }}>{t("WS_INFO_VALIDATION")}</span>
      </Card>
      <SearchForm onSubmit={onSubmit} handleSubmit={handleSubmit} >
        <SearchFields {...{ register, control, reset, tenantId, t,businessService }} />
      </SearchForm>
      { isLoading ? <Loader /> : null } 
      {data?.display && !resultOk ? (
        <Card style={{ marginTop: 20 }}>
          {t(data?.display)
            .split("\\n")
            .map((text, index) => (
              <p key={index} style={{ textAlign: "center" }}>
                {text}
              </p>
            ))}
        </Card>
      ) : resultOk ? (
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
      ) : null}
    </>
  );
};

export default SearchApplication;
