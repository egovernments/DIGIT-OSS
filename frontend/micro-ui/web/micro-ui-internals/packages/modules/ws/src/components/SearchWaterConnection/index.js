import React, { Fragment, useEffect, useCallback, useMemo } from "react";
import { SearchForm, Table, Card, Loader, Header } from "@egovernments/digit-ui-react-components";
import { useForm, Controller } from "react-hook-form";
import SearchFields from "./SearchFields";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import MobileSearchWater from "./MobileSearchWater";

const SearchWaterConnection = ({ tenantId, onSubmit, data, count, resultOk, businessService, isLoading }) => {
  const replaceUnderscore = (str) => {
    str = str.replace(/_/g, " ");
    return str;
  };

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

  const { t } = useTranslation();
  const { register, control, handleSubmit, setValue, getValues, reset } = useForm({
    defaultValues: {
      offset: 0,
      limit: 10,
      sortBy: "commencementDate",
      sortOrder: "DESC",
      searchType: "CONNECTION",
    },
  });

  useEffect(() => {
    register("offset", 0);
    register("limit", 10);
    register("sortBy", "commencementDate");
    register("searchType", "CONNECTION");
    register("sortOrder", "DESC");
    register("propertyId", "");
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
    return <MobileSearchWater {...{ Controller, register, control, t, reset, previousPage, handleSubmit, tenantId, data, onSubmit }} />;
  }
  //need to get from workflow
  const GetCell = (value) => <span className="cell-text">{value}</span>;
  const columns = useMemo(
    () => [
      {
        Header: t("WS_COMMON_TABLE_COL_CONSUMER_NO_LABEL"),
        disableSortBy: true,
        accessor: "connectionNo",
        Cell: ({ row }) => {
          return (
            <div>
              {row.original["connectionNo"] ? (
                <span className={"link"}>
                  <Link
                    to={`/digit-ui/employee/ws/connection-details?applicationNumber=${row.original["connectionNo"]}&tenantId=${tenantId}&service=${
                      row.original?.["service"]
                      }&connectionType=${row.original?.["connectionType"]}&due=${row.original?.due || 0}&from=WS_SEWERAGE_CONNECTION_SEARCH_LABEL`}
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
        Header: t("WS_COMMON_TABLE_COL_SERVICE_LABEL"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(t(`WS_${row.original?.["service"]}`));
        },
      },

      {
        Header: t("WS_COMMON_TABLE_COL_OWN_NAME_LABEL"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(row?.original?.connectionHolders?.map((owner) => owner?.name).join(",") ? row?.original?.connectionHolders?.map((owner) => owner?.name).join(",") : `${row.original?.["owner"] || "NA"}`);
        },
      },
      {
        Header: t("WS_COMMON_TABLE_COL_STATUS_LABEL"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(t(`WS_${row.original?.["status"]?.toUpperCase()}`));
        },
      },
      {
        Header: t("WS_COMMON_TABLE_COL_AMT_DUE_LABEL"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.["due"] || "NA"}`);
        },
      },
      {
        Header: t("WS_COMMON_TABLE_COL_ADDRESS"),
        disableSortBy: true,
        Cell: ({ row }) => {
          return GetCell(`${row.original?.["address"] || "NA"}`);
        },
      },
      {
        Header: t("WS_COMMON_TABLE_COL_DUE_DATE_LABEL"),
        disableSortBy: true,
        Cell: ({ row }) => {
          const status = row.original?.["status"]?.toUpperCase() || "";
          const dueDate = row.original?.dueDate === "NA" ? t("WS_NA") : convertEpochToDate(row.original?.dueDate);
          return GetCell(status === "INACTIVE" ? t("WS_NA") : t(`${dueDate}`));
        },
      },

      {
        Header: t("WS_COMMON_TABLE_COL_ACTION_LABEL"),
        disableSortBy: true,
        Cell: ({ row }) => {
          const amount = row.original?.due;

          if (amount > 0) {
            return GetCell(getActionItem(row.original?.status, row));
          } else {
            return GetCell(t(`${"WS_NA"}`));
          }
        },
      },
    ],
    []
  );

  const getActionItem = (status, row) => {
    const userInfo = Digit.UserService.getUser();
    const userRoles = userInfo.info.roles.map((roleData) => roleData.code);
    const isUserAllowedToAddMeterReading = userRoles.filter(role => (role === "WS_CEMP" || role === "SW_CEMP")).length > 0
    if(!isUserAllowedToAddMeterReading) return null
    switch (status) {
      case "Active":
        return (
          <div>
            <span className="link">
              {row.original?.service === "WATER" ? (
                <Link
                  to={{
                    pathname: `/digit-ui/employee/payment/collect/${row.original?.["service"] === "WATER" ? "WS" : "SW"}/${encodeURIComponent(
                      row.original?.["connectionNo"]
                    )}/${row.original?.["tenantId"]}?tenantId=${row.original?.["tenantId"]}?workflow=WS&ISWSCON`,
                  }}
                >
                  {t(`${"WS_COMMON_COLLECT_LABEL"}`)}{" "}
                </Link>
              ) : (
                <Link
                  to={{
                    pathname: `/digit-ui/employee/payment/collect/${row.original?.["service"] === "WATER" ? "WS" : "SW"}/${encodeURIComponent(
                      row.original?.["connectionNo"]
                    )}/${row.original?.["tenantId"]}?tenantId=${row.original?.["tenantId"]}?workflow=SW&ISWSCON`,
                  }}
                >
                  {t(`${"WS_COMMON_COLLECT_LABEL"}`)}{" "}
                </Link>
              )}
            </span>
          </div>
        );
    }
  };

  return (
    <>
      <Header styles={{ fontSize: "32px" }}>
        {businessService === "WS" ? t("WS_WATER_SEARCH_CONNECTION_SUB_HEADER") : t("WS_SEWERAGE_SEARCH_CONNECTION_SUB_HEADER")}
      </Header>
      <SearchForm className="ws-custom-wrapper" onSubmit={onSubmit} handleSubmit={handleSubmit}>
        <SearchFields {...{ register, control, reset, tenantId, t }} />
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
        // <></>
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

export default SearchWaterConnection;
