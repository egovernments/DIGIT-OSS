import React, { useCallback, useMemo, useEffect } from "react"
import { useForm, Controller } from "react-hook-form";
import { TextInput, SubmitBar, LinkLabel, ActionBar, CloseSvg, DatePicker, CardLabelError, SearchForm, SearchField, Dropdown, Table, Card, MobileNumber, Loader, CardText, Header } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";
import MobileSearchApplication from "./MobileSearchApplication";

const PTSearchApplication = ({tenantId, isLoading, t, onSubmit, data, count, setShowToast }) => {
    const isMobile = window.Digit.Utils.browser.isMobile();
    const { register, control, handleSubmit, setValue, getValues, reset, formState } = useForm({
        defaultValues: {
            offset: 0,
            limit: !isMobile && 10,
            sortBy: "commencementDate",
            sortOrder: "DESC"
        }
    })
    useEffect(() => {
      register("offset", 0)
      register("limit", 10)
      register("sortBy", "commencementDate")
      register("sortOrder", "DESC")
    },[register])
    //need to get from workflow
    const applicationTypes = [
        {
            code: "CREATE",
            i18nKey: "CREATE"
        },
        {
            code: "UPDATE",
            i18nKey: "UPDATE"
        },
        {
            code: "MUTATION",
            i18nKey: "MUTATION"
        },
    ]
    const applicationStatuses = [
        {
            code: "ACTIVE",
            i18nKey: "WF_PT_ACTIVE"
        },
        {
            code: "INACTIVE",
            i18nKey: "WF_PT_INACTIVE"
        },
        {
            code: "INWORKFLOW",
            i18nKey: "WF_PT_INWORKFLOW"
        },
    ]

    const getaddress = (address) => {
        let newaddr = `${address?.doorNo ? `${address?.doorNo}, ` : ""} ${address?.street ? `${address?.street}, ` : ""}${
            address?.landmark ? `${address?.landmark}, ` : ""
          }${t(address?.locality.code)}, ${t(address?.city)},${t(address?.pincode) ? `${address.pincode}` : " "}`
        return newaddr;
    }
    const GetCell = (value) => <span className="cell-text">{value}</span>;
    const columns = useMemo( () => ([
        {
            Header: t("PT_SEARCHPROPERTY_TABEL_PID"),
            disableSortBy: true,
            accessor: (row) => GetCell(row.propertyId || ""),
        },
        {
            Header: t("PT_APPLICATION_NO_LABEL"),
            accessor: "acknowldgementNumber",
            disableSortBy: true,
            Cell: ({ row }) => {
              return (
                <div>
                  <span className="link">
                    <Link to={`/digit-ui/employee/pt/applicationsearch/application-details/${row.original["propertyId"]}`}>
                      {row.original["acknowldgementNumber"]}
                    </Link>
                  </span>
                </div>
              );
            },
          },
          {
            Header: t("PT_SEARCHPROPERTY_TABEL_APPLICATIONTYPE"),
            disableSortBy: true,
            accessor: (row) => GetCell(row.creationReason || ""),
          },
          {
            Header: t("PT_COMMON_TABLE_COL_OWNER_NAME"),
            accessor: (row) => GetCell(row.owners.map( o => o.name ). join(",") || ""),
            disableSortBy: true,
          },
          {
            Header: t("ES_SEARCH_PROPERTY_STATUS"),
            accessor: (row) =>GetCell(t( row?.status &&`WF_PT_${row.status}`|| "NA") ),
            disableSortBy: true,
          },
          {
            Header: t("PT_ADDRESS_LABEL"),
            disableSortBy: true,
            accessor: (row) => GetCell(getaddress(row.address) || ""),
          },
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
    let validation={}

    return <React.Fragment>
                {isMobile ?
                <MobileSearchApplication {...{ Controller, register, control, t, reset, previousPage, handleSubmit, tenantId, data, onSubmit, formState, setShowToast }}/>
                 :
                <div>
                <Header>{t("PT_SEARCH_PROP_APP")}</Header>
                < Card className={"card-search-heading"}>
                    <span style={{color:"#505A5F"}}>{t("Provide at least one parameter to search for an application")}</span>
                </Card>
                <SearchForm onSubmit={onSubmit} handleSubmit={handleSubmit}>
                <SearchField>
                    <label>{t("PT_APPLICATION_NO_LABEL")}</label>
                    <TextInput name="acknowledgementIds" inputRef={register({})} />
                </SearchField>
                <SearchField>
                    <label>{t("PT_SEARCHPROPERTY_TABEL_PID")}</label>
                    <TextInput name="propertyIds" inputRef={register({})} />
                </SearchField>
                <SearchField>
                <label>{t("PT_OWNER_MOBILE_NO")}</label>
                <MobileNumber
                    name="mobileNumber"
                    inputRef={register({
                    minLength: {
                        value: 10,
                        message: t("CORE_COMMON_MOBILE_ERROR"),
                    },
                    maxLength: {
                        value: 10,
                        message: t("CORE_COMMON_MOBILE_ERROR"),
                    },
                    pattern: {
                    value: /[6789][0-9]{9}/,
                    //type: "tel",
                    message: t("CORE_COMMON_MOBILE_ERROR"),
                    },
                })}
                type="number"
                componentInFront={<div className="employee-card-input employee-card-input--front">+91</div>}
                //maxlength={10}
                />
                 <CardLabelError>{formState?.errors?.["mobileNumber"]?.message}</CardLabelError>
                </SearchField>
                <SearchField>
                    <label>{t("PT_SEARCHPROPERTY_TABEL_APPLICATIONTYPE")}</label>
                    <Controller
                            control={control}
                            name="creationReason"
                            render={(props) => (
                                <Dropdown
                                selected={props.value}
                                select={props.onChange}
                                onBlur={props.onBlur}
                                option={applicationTypes}
                                optionKey="i18nKey"
                                t={t}
                                disable={false}
                                />
                            )}
                            />
                </SearchField>
                <SearchField>
                    <label>{t("ES_SEARCH_PROPERTY_STATUS")}</label>
                    <Controller
                            control={control}
                            name="status"
                            render={(props) => (
                                <Dropdown
                                selected={props.value}
                                select={props.onChange}
                                onBlur={props.onBlur}
                                option={applicationStatuses}
                                optionKey="i18nKey"
                                t={t}
                                disable={false}
                                />
                            )}
                            />
                </SearchField>
                <SearchField>
                    <label>{t("PT_FROM_DATE")}</label>
                    <Controller
                        render={(props) => <DatePicker date={props.value} disabled={false} onChange={props.onChange} />}
                        name="fromDate"
                        control={control}
                        />
                </SearchField>
                <SearchField>
                    <label>{t("PT_TO_DATE")}</label>
                    <Controller
                        render={(props) => <DatePicker date={props.value} disabled={false} onChange={props.onChange} />}
                        name="toDate"
                        control={control}
                        />
                </SearchField>
                <SearchField className="submit">
                    <SubmitBar label={t("ES_COMMON_SEARCH")} submit />
                    <p style={{marginTop:"10px"}}
                     onClick={() => {
                        reset({ 
                            acknowledgementIds: "", 
                            fromDate: "", 
                            toDate: "",
                            propertyIds: "",
                            mobileNumber:"",
                            status: "",
                            creationReason: "",
                            offset: 0,
                            limit: 10,
                            sortBy: "commencementDate",
                            sortOrder: "DESC"
                        });
                        setShowToast(null);
                        previousPage();
                    }}>{t(`ES_COMMON_CLEAR_ALL`)}</p>
                </SearchField>
            </SearchForm>
            {!isLoading && data?.display ? <Card style={{ marginTop: 20 }}>
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
            :(!isLoading && data !== ""? <Table
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
            />: data !== "" || isLoading && <Loader/>)}
            </div>}
        </React.Fragment>
}

export default PTSearchApplication