import React, { useCallback, useMemo, useEffect } from "react"
import { useForm, Controller } from "react-hook-form";
import { TextInput, SubmitBar, LinkLabel, ActionBar, CloseSvg, DatePicker, CardLabelError, SearchForm, SearchField, Dropdown, Table, Card } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";
import { convertEpochToDateDMY } from  "../utils";

const OBPSSearchApplication = ({tenantId, t, onSubmit, data }) => {
    let validation = {};
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
    },[register])
    const { data: applicationTypes } = Digit.Hooks.tl.useMDMS.applicationTypes(tenantId)
    //need to get from workflow
    const ServiceTypes = [
        {
            code: "BPA",
            i18nKey: "BPA"
        },
        {
            code: "BPAREG",
            i18nKey: "BPAREG"
        }
    ]
    const applicationStatuses = [
        {
            code: "CANCELLED",
            i18nKey: "WF_NEWTL_CANCELLED"
        },
        {
            code: "APPROVED",
            i18nKey: "WF_NEWTL_APPROVED"
        },
        {
            code: "EXPIRED",
            i18nKey: "WF_NEWTL_EXPIRED"
        },
        {
            code: "APPLIED",
            i18nKey: "WF_NEWTL_APPLIED"
        },
        {
            code: "REJECTED",
            i18nKey: "WF_NEWTL_REJECTED"
        },
        {
            code: "PENDINGPAYMENT",
            i18nKey: "WF_NEWTL_PENDINGPAYMENT"
        },
        {
            code: "FIELDINSPECTION",
            i18nKey: "WF_NEWTL_FIELDINSPECTION"
        },
        {
            code: "CITIZENACTIONREQUIRED",
            i18nKey: "WF_NEWTL_CITIZENACTIONREQUIRED"
        },
        {
            code: "PENDINGAPPROVAL",
            i18nKey: "WF_NEWTL_PENDINGAPPROVAL"
        },
        {
            code: "INITIATED",
            i18nKey: "WF_NEWTL_INITIATED"
        }	
    ]
    const GetCell = (value) => <span className="cell-text">{value}</span>;
    const columns = useMemo( () => ([
        {
          Header: t("App Number"),
          accessor: "applicationNo",
          disableSortBy: true,
          Cell: ({ row }) => {
            return (
              <div>
                <span className="link">
                  <Link to={`/digit-ui/employee/obps/application-details/${row.original["applicationNo"] || row.original["applicationNumber"]}`}>
                    {row.original["applicationNo"] || row.original["applicationNumber"]}
                  </Link>
                </span>
              </div>
            );
          },
        },
        {
            Header: t("App date"),
            disableSortBy: true,
            accessor: (row) => GetCell(row.auditDetails.createdTime ? convertEpochToDateDMY(row.auditDetails.createdTime) : ""),
        },
        {
            Header: t("App Type"),
            disableSortBy: true,
            accessor: (row) => GetCell(t(`${row.additionalDetails?.applicationType}`)),
        },
        {
            Header: t("Service Type"),
            disableSortBy: true,
            accessor: (row) => GetCell(row.additionalDetails?.serviceType || "-"),
        },
        {
          Header: t("Current Owner"),
          accessor: (row) => GetCell(row.businessService === "BPAREG"?row.tradeLicenseDetail.owners.map( o => o.name ). join(",") || "" : row.landInfo.owners.map( o => o.name ). join(",") || ""),
          disableSortBy: true,
        },
        {
          Header: t("Status"),
          accessor: (row) =>GetCell(t(row?.state&&`WF_${row.state}`|| "NA") ),
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
                    <label>{t("Application Number")}</label>
                    <TextInput name="applicationNumber" inputRef={register({})} />
                </SearchField>
                <SearchField>
                    <label>{t("Application Mobile Number")}</label>
                    <TextInput name="mobileNumber" inputRef={register({})} 
                        type="mobileNumber"
                        componentInFront={<div className="employee-card-input employee-card-input--front">+91</div>} 
                        maxlength={10}
                        {...(validation = {
                        pattern: "[6-9]{1}[0-9]{9}",
                        type: "tel",
                        title: t("CORE_COMMON_APPLICANT_MOBILE_NUMBER_INVALID"),
                        })}/>
                </SearchField>
                <SearchField>
                    <label>{t("Application Type")}</label>
                    <Controller
                            control={control}
                            name="applicationType"
                            render={(props) => (
                                <Dropdown
                                selected={props.value}
                                select={props.onChange}
                                onBlur={props.onBlur}
                                option={applicationTypes}
                                optionKey="i18nKey"
                                t={t}
                                />
                            )}
                            />
                </SearchField>
                <SearchField>
                    <label>{t("Service Type")}</label>
                    <Controller
                            control={control}
                            name="ServiceType"
                            render={(props) => (
                                <Dropdown
                                selected={props.value}
                                select={props.onChange}
                                onBlur={props.onBlur}
                                option={ServiceTypes}
                                optionKey="i18nKey"
                                t={t}
                                />
                            )}
                            />
                </SearchField>
                <SearchField>
                    <label>{t("Application From Date")}</label>
                    <Controller
                        render={(props) => <DatePicker date={props.value} onChange={props.onChange} />}
                        name="fromDate"
                        control={control}
                        />
                </SearchField>
                <SearchField>
                    <label>{t("Application To Date")}</label>
                    <Controller
                        render={(props) => <DatePicker date={props.value} onChange={props.onChange} />}
                        name="toDate"
                        control={control}
                        />
                </SearchField>
                <SearchField>
                    <label>{t("Application Status")}</label>
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
                                />
                            )}
                            />
                </SearchField>
                <SearchField className="submit">
                    <SubmitBar label={t("ES_COMMON_SEARCH")} submit />
                    <p onClick={() => {
                        reset({ 
                            applicationType: "", 
                            fromDate: "", 
                            toDate: "",
                            licenseNumbers: "",
                            status: "",
                            tradeName: "",
                            offset: 0,
                            limit: 10,
                            sortBy: "commencementDate",
                            sortOrder: "DESC"
                        });
                        previousPage();
                    }}>{t(`ES_COMMON_CLEAR_ALL`)}</p>
                </SearchField>
            </SearchForm>
            {data?.display ? <Card style={{ marginTop: 20 }}>
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
                data={data}
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

export default OBPSSearchApplication