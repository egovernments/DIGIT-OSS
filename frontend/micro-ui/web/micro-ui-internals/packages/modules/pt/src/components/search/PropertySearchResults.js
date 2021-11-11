import { Loader, Table } from "@egovernments/digit-ui-react-components";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const GetCell = (value) => <span className="cell-text">{value}</span>;

const SearchPTID = ({ tenantId, t, payload }) => {
  const [defaultValues, setValue] = useState({ sortOrder: "DESC", limit: 10, offset: 0, sortBy: "createdDate" });
  const getValues = (key) => defaultValues[key];

  const [searchQuery, setSearchQuery] = useState({ ...defaultValues, ...payload });

  useEffect(() => {
    setSearchQuery({ ...defaultValues, ...payload });
  }, [payload, defaultValues]);
  const { data, isLoading, error, isSuccess, billData } = Digit.Hooks.pt.usePropertySearchWithDue({
    tenantId,
    filters: searchQuery,
    configs: { enabled: Object.keys(payload).length > 0 ? true : false, retry: false, retryOnMount: false, staleTime: Infinity },
  });

  const columns = useMemo(
    () => [
      {
        Header: t("PT_COMMON_TABLE_COL_PT_ID"),
        accessor: "propertyId",
        disableSortBy: true,
        Cell: ({ row }) => {
          return (
            <div>
              <span className="link">
                <Link to={`/digit-ui/employee/pt/property-details/${row.original["propertyId"]}`}>{row.original["propertyId"]}</Link>
              </span>
            </div>
          );
        },
      },
      {
        Header: t("PT_COMMON_TABLE_COL_OWNER_NAME"),
        disableSortBy: true,
        accessor: (row) => GetCell(row.name || ""),
      },

      {
        Header: t("ES_INBOX_LOCALITY"),
        disableSortBy: true,
        accessor: (row) => GetCell(t(row.locality) || ""),
        // accessor: (row) => GetCell( t(`${stringReplaceAll(row.tenantId?.toUpperCase(), ".", "_")}_REVENUE_${row.tradeLicenseDetail.address.locality.code}`) || ""),
      },
      {
        Header: t("PT_COMMON_TABLE_COL_STATUS_LABEL"),
        accessor: (row) => GetCell(t(row?.status || "NA")),
        disableSortBy: true,
      },
      {
        Header: t("PT_AMOUNT_DUE"),
        accessor: (row) => GetCell(t(row?.due || "NA")),
        disableSortBy: true,
      },
      {
        Header: t("ES_SEARCH_ACTION"),
        accessor: "action",
        disableSortBy: true,
        Cell: ({ row }) => {
          return (
            <div>
              {/* {row.original?.due> 0? (  */}
              {row.original?.due > 0 && Digit.Utils.didEmployeeHasRole("PT_CEMP") ? (
                <span className="link">
                  <Link to={`/digit-ui/employee/payment/collect/PT/` + row.original?.["propertyId"]}>{t("ES_PT_COLLECT_TAX")}</Link>
                </span>
              ) : null}
            </div>
          );
        },
      },
    ],
    []
  );

  const onSort = useCallback((args) => {
    // if (args.length === 0) return;
    // setValue("sortBy", args.id);
    // setValue("sortOrder", args.desc ? "DESC" : "ASC");
  }, []);

  const onPageSizeChange = useCallback((e) => {
    setValue("limit", Number(e.target.value));
    // handleSubmit(onSubmit)();
  });

  const nextPage = useCallback(() => {
    setValue("offset", getValues("offset") + getValues("limit"));
    // handleSubmit(onSubmit)();
  });
  const previousPage = useCallback(() => {
    setValue("offset", getValues("offset") - getValues("limit"));
    // handleSubmit(onSubmit)();
  });
  if (isLoading) {
    return <Loader />;
  }
  const PTEmptyResultInbox = memo(Digit.ComponentRegistryService.getComponent("PTEmptyResultInbox"));
  return (
    <React.Fragment>
      {data?.Properties?.length == 0 ? (
        <PTEmptyResultInbox data={true}></PTEmptyResultInbox>
      ) : (
        <Table
          t={t}
          data={Object.values(data?.FormattedData || {}) || []}
          totalRecords={data?.Properties?.length}
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
      )}
    </React.Fragment>
  );
};

export default SearchPTID;
