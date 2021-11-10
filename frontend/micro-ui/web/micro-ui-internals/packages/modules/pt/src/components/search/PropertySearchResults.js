import React, { useCallback, useMemo, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  TextInput,
  SubmitBar,
  LinkLabel,
  ActionBar,
  CloseSvg,
  DatePicker,
  CardLabelError,
  SearchForm,
  SearchField,
  Dropdown,
  Table,
  Card,
  Loader,
} from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";
// import { convertEpochToDateDMY, stringReplaceAll } from "../utils";

const GetCell = (value) => <span className="cell-text">{value}</span>;

const SearchPTID = ({ tenantId, t, payload }) => {
  const [defaultValues, setValue] = useState({ sortOrder: "DESC", limit: 10, offset: 0, sortBy: "createdDate" });
  const getValues = (key) => defaultValues[key];


  const [searchQuery, setSearchQuery] = useState({ ...defaultValues, ...payload });
  console.log(payload,searchQuery,defaultValues,"render");

  useEffect(() => {
    setSearchQuery({ ...defaultValues, ...payload });
  }, [payload, defaultValues]);
  const { data, isLoading, error, isSuccess,billData } = Digit.Hooks.pt.usePropertySearchWithDue({
      tenantId,
      filters: searchQuery,
      configs: { enabled: Object.keys(payload).length > 0 ? true : false, retry: false, retryOnMount: false, staleTime: Infinity },
    })
  

  const columns = useMemo(
    () => [
      {
        Header: t("TL_TRADE_LICENSE_LABEL"),
        accessor: "licenseNumber",
        disableSortBy: true,
        Cell: ({ row }) => {
          return (
            <div>
              <span className="link">
                <Link to={`/digit-ui/employee/tl/application-details/${row.original["applicationNumber"]}?renewalPending=true`}>
                  {row.original["licenseNumber"]}
                </Link>
              </span>
            </div>
          );
        },
      },
      {
        Header: t("TL_LOCALIZATION_TRADE_NAME"),
        disableSortBy: true,
        accessor: (row) => GetCell(row.tradeName || ""),
      },

      {
        Header: t("TL_HOME_SEARCH_RESULTS__LOCALITY"),
        disableSortBy: true,
        accessor: (row) => GetCell(row.address.locality.name || ""),
        // accessor: (row) => GetCell( t(`${stringReplaceAll(row.tenantId?.toUpperCase(), ".", "_")}_REVENUE_${row.tradeLicenseDetail.address.locality.code}`) || ""),
      },
      {
        Header: t("TL_COMMON_TABLE_COL_STATUS"),
        accessor: (row) => GetCell(t((row?.workflowCode && row?.status && `WF_${row?.workflowCode?.toUpperCase()}_${row.status}`) || "NA")),
        disableSortBy: true,
      },
    ],
    []
  );

  const onSort = useCallback((args) => {
    // if (args.length === 0) return;
    // setValue("sortBy", args.id);
    // setValue("sortOrder", args.desc ? "DESC" : "ASC");
  }, []);

  const onPageSizeChange=useCallback((e) =>{
    setValue("limit", Number(e.target.value));
    // handleSubmit(onSubmit)();
  })

  const nextPage=useCallback(()=> {
    setValue("offset", getValues("offset") + getValues("limit"));
    // handleSubmit(onSubmit)();
  })
  const previousPage=useCallback(()=> {
    setValue("offset", getValues("offset") - getValues("limit"));
    // handleSubmit(onSubmit)();
  })
  if (isLoading) {
    return <Loader />;
  }
  return (
    <React.Fragment>
      {data?.Properties?.length == 0 ? (
        <Card style={{ marginTop: 20 }}>
          {t("NO RESULT")
            .split("\\n")
            .map((text, index) => (
              <p key={index} style={{ textAlign: "center" }}>
                {text}
              </p>
            ))}
        </Card>
      ) : (
        <Table
          t={t}
          data={data?.Properties || []}
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
