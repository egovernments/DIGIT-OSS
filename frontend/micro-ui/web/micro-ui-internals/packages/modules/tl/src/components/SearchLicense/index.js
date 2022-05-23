import React, { useCallback, useMemo, useEffect } from "react"
import { useForm, Controller } from "react-hook-form";
import { TextInput, SubmitBar, LinkLabel, ActionBar, CloseSvg, DatePicker, CardLabelError, SearchForm, Header, SearchField, Dropdown, Table, Card } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";
import { convertEpochToDateDMY, stringReplaceAll } from "../../utils";
import SearchFields from "./SearchFields";
import MobileSearchApplication from "./MobileSearchApplication";

const SearchLicense = ({tenantId, t, onSubmit, data, count }) => {

    const { register, control, handleSubmit, setValue, getValues, reset } = useForm({
        defaultValues: {
            offset: 0,
            limit: 10,
            sortBy: "commencementDate",
            sortOrder: "DESC",
            status: "",
            RenewalPending: true
        }
    })
    useEffect(() => {
      register("offset", 0)
      register("limit", 10)
      register("sortBy", "commencementDate")
      register("sortOrder", "DESC")
      register("status", "")
      register("RenewalPending", true)
    },[register])

    const onSort = useCallback((args) => {
      if (args.length === 0) return
      setValue("sortBy", args.id)
      setValue("sortOrder", args.desc ? "DESC" : "ASC")
    }, [])


    function onPageSizeChange(e){
      setValue("limit",Number(e.target.value))
      handleSubmit(onSubmit)()
    }

    function nextPage () {
        setValue("offset", getValues("offset") + getValues("limit"))
        handleSubmit(onSubmit)()
    }
    function previousPage () {
        setValue("offset", getValues("offset") - getValues("limit") )
        handleSubmit(onSubmit)()
    }

    const isMobile = window.Digit.Utils.browser.isMobile();

    if (isMobile) {
      return <MobileSearchApplication {...{ Controller, register, control, t, reset, previousPage, handleSubmit, tenantId, data, onSubmit }}/>
    }

    const GetCell = (value) => <span className="cell-text">{value}</span>;
    const columns = useMemo( () => ([
        {
          Header: t("TL_TRADE_LICENSE_LABEL"),
          accessor: "licenseNumber",
          disableSortBy: true,
          Cell: ({ row }) => {
            return (
              <div>
                <span className="link">
                  <a href={`/digit-ui/employee/tl/application-details/${row.original["applicationNumber"]}?renewalPending=true`}>
                    {row.original["licenseNumber"]}
                  </a>
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
            Header: t("ES_APPLICATION_SEARCH_ISSUED_DATE"),
            disableSortBy: true,
            accessor: (row) => GetCell(row.issuedDate? convertEpochToDateDMY(row.issuedDate) : ""),
        },
        {
            Header: t("ES_APPLICATION_SEARCH_VALID_TO"),
            disableSortBy: true,
            accessor: (row) => GetCell(row.validTo? convertEpochToDateDMY(row.validTo) : ""),
        },
        {
            Header: t("TL_HOME_SEARCH_RESULTS__LOCALITY"),
            disableSortBy: true,
            // accessor: (row) => GetCell(row.tradeLicenseDetail.address.locality.name || ""),
            accessor: (row) => GetCell( t(`${stringReplaceAll(row.tenantId?.toUpperCase(), ".", "_")}_REVENUE_${row.tradeLicenseDetail.address.locality.code}`) || ""),
        },
        {
          Header: t("TL_COMMON_TABLE_COL_STATUS"),
          accessor: (row) =>GetCell(t( row?.workflowCode&&row?.status&&`WF_${row?.workflowCode?.toUpperCase()}_${row.status}`|| "NA") ),
          disableSortBy: true,
        }
      ]), [] )

    return <React.Fragment>
        <Header>{t("TL_SEARCH_LICENSE")}</Header>
        <SearchForm onSubmit={onSubmit} handleSubmit={handleSubmit}>
          <SearchFields {...{register, control, reset, tenantId, t}} />
        </SearchForm>
        {data?.display ?<Card style={{ marginTop: 20 }}>
            {
            t(data.display)
                .split("\\n")
                .map((text, index) => (
                <p key={index} style={{ textAlign: "center" }}>
                    {text}
                </p>
                ))
            }
        </Card>
        : data !== "" && <Table
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
            currentPage={getValues("offset")/getValues("limit")}
            onNextPage={nextPage}
            onPrevPage={previousPage}
            pageSizeLimit={getValues("limit")}
            onSort={onSort}
            disableSort={false}
            sortParams={[{id: getValues("sortBy"), desc: getValues("sortOrder") === "DESC" ? true : false}]}
        />}
        </React.Fragment>
}

export default SearchLicense