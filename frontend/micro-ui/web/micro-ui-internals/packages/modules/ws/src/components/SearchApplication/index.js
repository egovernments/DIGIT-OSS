import React, { Fragment, useEffect, useCallback, useMemo } from 'react'
import { SearchForm, Table, Card, Loader, Header } from "@egovernments/digit-ui-react-components";
import { useForm, Controller } from "react-hook-form";
import SearchFields from './SearchFields';
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';
import MobileSearchApplication from './MobileSearchApplication'
const SearchApplication = ({ tenantId, onSubmit, data, count, resultOk }) => {
  const replaceUnderscore = (str) => {
    str = str.replace(/_/g, " ");
    return str;
  }


  const { t } = useTranslation();
  const { register, control, handleSubmit, setValue, getValues, reset } = useForm({
    defaultValues: {
      offset: 0,
      limit: 10,
      sortBy: "commencementDate",
      sortOrder: "DESC"
    }
  })

  useEffect(() => {
    register("offset", 0)
    register("limit", 10)
    register("sortBy", "commencementDate")
    register("sortOrder", "DESC")
  }, [register])

  const onSort = useCallback((args) => {
    if (args.length === 0) return
    setValue("sortBy", args.id)
    setValue("sortOrder", args.desc ? "DESC" : "ASC")
  }, [])

  function onPageSizeChange(e) {
    setValue("limit", Number(e.target.value))
    handleSubmit(onSubmit)()
  }

  function nextPage() {
    setValue("offset", getValues("offset") + getValues("limit"))
    handleSubmit(onSubmit)()
  }
  function previousPage() {
    setValue("offset", getValues("offset") - getValues("limit"))
    handleSubmit(onSubmit)()
  }

    const isMobile = window.Digit.Utils.browser.isMobile();

    if (isMobile) {
      return <MobileSearchApplication {...{ Controller, register, control, t, reset, previousPage, handleSubmit, tenantId, data, onSubmit }}/>
    }


  //need to get from workflow
  const GetCell = (value) => <span className="cell-text">{value}</span>;
  const columns = useMemo(() => ([
    {
      Header: t("WS_MYCONNECTIONS_CONSUMER_NO"),
      disableSortBy: true,
      accessor: "connectionNo",
      Cell: ({ row }) => {
        return (
          <div>
            {row.original["connectionNo"] ? <span className={"link"}>
              <Link to={`/digit-ui/employee/ws/connection-details/${row.original["connectionNo"]}`}>
                {row.original["connectionNo"] || "NA"}
              </Link>
            </span> : <span>
              {t("NA")}</span>}
          </div>
        );
      }
    },
    {
      Header: t("WS_ACK_COMMON_APP_NO_LABEL"),
      accessor: "applicationNo",
      disableSortBy: true,
      Cell: ({ row }) => {
        let service = "WATER"
        if (row.original["applicationNo"].includes("SW")) service = "SEWERAGE"
        return (
          <div>
            <span className="link">
              <Link to={`/digit-ui/employee/ws/application-details?applicationNumber=${row.original["applicationNo"]}&tenantId=${tenantId}&service=${service}`}>
                {row.original["applicationNo"]}
              </Link>
            </span>
          </div>
        );
      },
    },
    {
      Header: t("WS_APPLICATION_TYPE_LABEL"),
      disableSortBy: true,
      accessor: (row) => GetCell(replaceUnderscore(row.applicationType)),
    },
    {
      Header: t("WS_COMMON_TABLE_COL_OWN_NAME_LABEL"),
      disableSortBy: true,
      accessor: (row) => {
        return GetCell(row?.owner || "-")
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
  ]), [])


  return (
    <>
      <Header styles={{ fontSize: "32px" }}>{t("WS_SEARCH_APPLICATION_SUB_HEADER")}</Header>
      <SearchForm onSubmit={onSubmit} handleSubmit={handleSubmit}>
        <SearchFields {...{ register, control, reset, tenantId, t }} />
      </SearchForm>
      {data?.display ? <Card style={{ marginTop: 20 }}>
        {
          t(data?.display)
            .split("\\n")
            .map((text, index) => (
              <p key={index} style={{ textAlign: "center" }}>
                {text}
              </p>
            ))
        }
      </Card> :
        resultOk ? <Table
          t={t}
          data={data}
          totalRecords={count}
          columns={columns}
          getCellProps={(cellInfo) => {
            return {
              style: {
                minWidth: cellInfo.column.Header === t("ES_INBOX_APPLICATION_NO") ? "240px" : "",
                padding: "20px 18px",
                fontSize: "16px"
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
        /> : <Loader />}
    </>
  )
}

export default SearchApplication