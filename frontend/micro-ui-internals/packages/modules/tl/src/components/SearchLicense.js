import React, { useCallback, useMemo, useEffect } from "react"
import { useForm, Controller } from "react-hook-form";
import { TextInput, SubmitBar, LinkLabel, ActionBar, CloseSvg, DatePicker, CardLabelError, SearchForm, SearchField, Dropdown, Table, Card } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";
import { convertEpochToDateDMY, stringReplaceAll } from "../utils";

const SearchLicense = ({tenantId, t, onSubmit, data }) => {
  let applications = {};
    const applicationsList = data;
    let newapplicationlist = [];
    if (applicationsList && applicationsList.length > 0) {
        applicationsList.filter((response) => response.licenseNumber).map((ob) => {
            if (applications[ob.licenseNumber]) {
                if (applications[ob.licenseNumber].applicationDate < ob.applicationDate)
                    applications[ob.licenseNumber] = ob
            }
            else
                applications[ob.licenseNumber] = ob;
        })
        newapplicationlist = Object.values(applications);
        newapplicationlist = newapplicationlist ? newapplicationlist.filter(ele => ele.financialYear != "2021-22" && (ele.status == "EXPIRED" || ele.status == "APPROVED")) : [];
    }

    const { register, control, handleSubmit, setValue, getValues, reset } = useForm({
        defaultValues: {
            offset: 0,
            limit: 10,
            sortBy: "commencementDate",
            sortOrder: "DESC",
            status: "APPROVED"
        }
    })
    useEffect(() => {
      register("offset", 0)
      register("limit", 10)
      register("sortBy", "commencementDate")
      register("sortOrder", "DESC")
      register("status", "APPROVED")
    },[register])

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
                  <Link to={`/digit-ui/employee/tl/application-details/${row.original["applicationNumber"]}`}>
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
            accessor: (row) => GetCell( t(`${stringReplaceAll(row.tradeLicenseDetail.address?.city?.toUpperCase(), ".", "_")}_REVENUE_${row.tradeLicenseDetail.address.locality.code}`) || ""),
        },
        {
          Header: t("TL_COMMON_TABLE_COL_STATUS"),
          accessor: (row) =>GetCell(t( row?.workflowCode&&row?.status&&`WF_${row?.workflowCode?.toUpperCase()}_${row.status}`|| "NA") ),
          disableSortBy: true,
        }
      ]), [] )

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

    return <React.Fragment>
            <SearchForm onSubmit={onSubmit} handleSubmit={handleSubmit}>
            <SearchField>
                <label>{t("TL_TRADE_LICENSE_LABEL")}</label>
                <TextInput name="licenseNumbers" inputRef={register({})} />
            </SearchField>
            <SearchField>
                <label>{t("TL_TRADE_OWNER_S_NUMBER_LABEL")}</label>
                <TextInput name="mobileNumber" inputRef={register({})}/>
            </SearchField>
            <SearchField>
                <label>{t("TL_SEARCH_TRADE_LICENSE_ISSUED_FROM")}</label>
                <Controller
                  render={(props) => <DatePicker date={props.value} onChange={props.onChange} />}
                  name="fromDate"
                  control={control}
                />
            </SearchField>
            <SearchField>
                <label>{t("TL_SEARCH_TRADE_LICENSE_ISSUED_TO")}</label>
                <Controller
                    render={(props) => <DatePicker date={props.value} onChange={props.onChange} />}
                    name="toDate"
                    control={control}
                  />
            </SearchField>
            <SearchField>
                <label>{t("TL_LOCALIZATION_TRADE_NAME")}</label>
                <TextInput name="tradeName" inputRef={register({})}/>
            </SearchField>
            <SearchField className="submit">
                <SubmitBar label={t("ES_COMMON_SEARCH")} submit />
                <p onClick={() => 
                  {
                    reset({ 
                      licenseNumbers: "", 
                      mobileNumber: "", 
                      fromDate: "",
                      toDate: "",
                      offset: 0,
                      limit: 10,
                      sortBy: "commencementDate",
                      sortOrder: "DESC",
                      status: "APPROVED"
                  });
                  previousPage ();
                  }
                }>{t(`ES_COMMON_CLEAR_ALL`)}</p>
            </SearchField>
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
        : <Table
            t={t}
            data={newapplicationlist}
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
            totalRecords={100}
        />}
        </React.Fragment>
}

export default SearchLicense