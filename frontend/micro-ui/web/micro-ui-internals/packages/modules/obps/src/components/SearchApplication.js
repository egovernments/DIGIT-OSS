import React, { useCallback, useMemo, useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form";
import { TextInput, SubmitBar, LinkLabel, ActionBar, CloseSvg, DatePicker, CardLabelError, SearchForm, SearchField, Dropdown, Table, Card } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";
import { convertEpochToDateDMY } from  "../utils";

const OBPSSearchApplication = ({tenantId, t, onSubmit, data, isLoading, Count }) => {
    let validation = {};
    const [ Applicationtype, setApplicationtype] = useState("BUILDING_PLAN_SCRUTINY");
    const { data: applicationTypes } = Digit.Hooks.obps.useSearchMdmsTypes.applicationTypes(tenantId.split(".")[0]);
    const { data: serviceTypes } = Digit.Hooks.obps.useSearchMdmsTypes.serviceTypes(tenantId.split(".")[0]);
    let defaultAppType = applicationTypes && applicationTypes.filter((ob) => ob.code === "BUILDING_PLAN_SCRUTINY")[0];
    let defaultserviceType = serviceTypes && serviceTypes.filter((ob) => ob.code === "NEW_CONSTRUCTION")[0];
    const [serviceType, setserviceType] = useState(defaultserviceType);
    const { register, control, handleSubmit, setValue, getValues, reset } = useForm({
        defaultValues: {
            offset: 0,
            limit: 10,
            sortBy: "commencementDate",
            sortOrder: "DESC",
            applicationType: defaultAppType, 
            serviceType: defaultserviceType,
        }
    })
    useEffect(() => {
      register("offset", 0)
      register("limit", 10)
      register("sortBy", "commencementDate")
      register("sortOrder", "DESC")
    },[register])

    //need to get from workflow

    if(applicationTypes && applicationTypes.length>0)
    {
        applicationTypes.push({
            code: "BPA_STAKEHOLDER_REGISTRATION",
            i18nKey: "BPA_APPLICATIONTYPE_BPA_STAKEHOLDER_REGISTRATION",
        })
    }


    let ServiceTypes = [];
    useEffect(() => {
        serviceTypes && serviceTypes.push({
            applicationType:["BPA_STAKEHOLDER_REGISTRATION"],
            code: "BPA_STAKEHOLDER_REGISTRATION",
            i18nKey: "BPA_SERVICETYPE_BPA_STAKEHOLDER_REGISTRATION",
        })
        serviceTypes && serviceTypes.filter((ob) => ob.applicationType.includes(Applicationtype)).map((ser) => {
            ServiceTypes.push({
                code:ser.code,
                i18nKey:ser.i18nKey,
            })
        });
        
    },[Applicationtype,serviceTypes,applicationTypes]);

    useEffect(() => {
        Applicationtype && (Applicationtype.includes("STAKEHOLDER") || (Applicationtype?.code && Applicationtype?.code.includes("STAKEHOLDER"))) ? setserviceType({
            applicationType:["BPA_STAKEHOLDER_REGISTRATION"],
            code: "BPA_STAKEHOLDER_REGISTRATION",
            i18nKey: "BPA_SERVICETYPE_BPA_STAKEHOLDER_REGISTRATION",
        }):setserviceType(defaultserviceType);
    },[Applicationtype]);

    const fetchLastPage = () => {
        setValue("offset", Count && (Math.ceil(Count / 10) * 10 - getValues("limit")));
        handleSubmit(onSubmit)()
    };

    const fetchFirstPage = () => {
        setValue("offset", 0);
        handleSubmit(onSubmit)()
      };

    const applicationStatuses = [
        {
            code: "CANCELLED",
            i18nKey: "WF_BPA_CANCELLED"
        },
        {
            code: "APPROVED",
            i18nKey: "WF_BPA_APPROVED"
        },
        {
            code: "INPROGRESS",
            i18nKey: "WF_BPA_INPROGRESS"
        },
        {
            code: "PENDINGPAYMENT",
            i18nKey: "WF_NEWTL_PENDINGPAYMENT"
        },
        {
            code: "CITIZEN_APPROVAL_INPROCESS",
            i18nKey: "WF_BPA_CITIZEN_APPROVAL_INPROCESS"
        },
        {
            code: "CITIZEN_APPROVAL_PENDING",
            i18nKey: "WF_BPA_CITIZEN_APPROVAL_PENDING"
        },
        {
            code: "DOC_VERIFICATION_PENDING",
            i18nKey: "WF_BPA_DOC_VERIFICATION_PENDING"
        },
        {
            code: "FIELDINSPECTION_PENDING",
            i18nKey: "WF_BPA_FIELDINSPECTION_PENDING"
        },
        {
            code: "INITIATED",
            i18nKey: "WF_BPA_INITIATED"
        }	
    ]

    function getApplicationType(data){
        data && setApplicationtype(data.code || "BUILDING_PLAN_SCRUTINY");
        return data?data:defaultAppType;
    }

    function getselectedServiceType(data){
        if(data && data.code!== serviceType.code) data=serviceType;
        return data?data:(serviceType?serviceType:defaultserviceType);
    }
    
    const getRedirectionLink = (bService) => {
        let redirectBS = bService === "BPAREG"?"stakeholder":"search/application/bpa";
        return redirectBS;
    }
    const GetCell = (value) => <span className="cell-text">{value}</span>;
    const columns = useMemo( () => ([
        {
          Header: t("BPA_APPLICATION_NUMBER_LABEL"),
          accessor: "applicationNo",
          disableSortBy: true,
          Cell: ({ row }) => {
            return (
              <div>
                <span className="link">
                  <Link to={`/digit-ui/employee/obps/${getRedirectionLink(row.original["businessService"]) || "--"}/${row.original["applicationNo"] || row.original["applicationNumber"]}`}>
                    {row.original["applicationNo"] || row.original["applicationNumber"]}
                  </Link>
                </span>
              </div>
            );
          },
        },
        {
            Header: t("BPA_COMMON_TABLE_COL_APP_DATE_LABEL"),
            disableSortBy: true,
            accessor: (row) => GetCell(row.auditDetails.createdTime ? convertEpochToDateDMY(row.auditDetails.createdTime) : ""),
        },
        {
            Header: t("BPA_SEARCH_APPLICATION_TYPE_LABEL"),
            disableSortBy: true,
            accessor: "applicationType",
            Cell: ({ row }) => {
                return (
                    <div>
                      <span className="cell-text">
                          {t(`${row.original?.additionalDetails?.applicationType || "-"}`)}
                      </span>
                    </div>
                  );
            },
        },
        {
            Header: t("BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL"),
            disableSortBy: true,
            accessor: (row) => GetCell(t(row.additionalDetails?.serviceType || "-")),
        },
        {
          Header: t("BPA_CURRENT_OWNER_HEAD"),
          accessor: (row) => GetCell(row.businessService === "BPAREG"?row.tradeLicenseDetail.owners.map( o => o.name ). join(",") || "" : row.landInfo.owners.map( o => o.name ). join(",") || ""),
          disableSortBy: true,
        },
        {
          Header: t("BPA_STATUS_LABEL"),
          accessor: (row) =>GetCell(t(row?.state&&`WF_BPA_${row.state}`|| "NA") ),
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
                    <label>{t("BPA_SEARCH_APPLICATION_NO_LABEL")}</label>
                    <TextInput name="applicationNo" inputRef={register({})} />
                </SearchField>
                <SearchField>
                    <label>{t("BPA_APP_MOBILE_NO_SEARCH_PARAM")}</label>
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
                    <label>{t("BPA_SEARCH_APPLICATION_TYPE_LABEL")}</label>
                    <Controller
                            control={control}
                            name="applicationType"
                            render={(props) => (
                                <Dropdown
                                selected={getApplicationType(props.value)}
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
                    <label>{t("BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL")}</label>
                    <Controller
                            control={control}
                            name="serviceType"
                            render={(props) => (
                                <Dropdown
                                selected={getselectedServiceType(props.value)}
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
                    <label>{t("BPA_APP_FROM_DATE_SEARCH_PARAM")}</label>
                    <Controller
                        render={(props) => <DatePicker date={props.value} onChange={props.onChange} />}
                        name="fromDate"
                        control={control}
                        />
                </SearchField>
                <SearchField>
                    <label>{t("BPA_APP_TO_DATE_SEARCH_PARAM")}</label>
                    <Controller
                        render={(props) => <DatePicker date={props.value} onChange={props.onChange} />}
                        name="toDate"
                        control={control}
                        />
                </SearchField>
                <SearchField>
                    <label>{t("BPA_SEARCH_APPLICATION_STATUS_LABEL")}</label>
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
                            applicationNo: "",
                            mobileNumber: "",
                            applicationType: defaultAppType, 
                            serviceType: defaultserviceType,
                            fromDate: "", 
                            toDate: "",
                            status: "",
                            offset: 0,
                            limit: 10,
                            sortBy: "commencementDate",
                            sortOrder: "DESC"
                        });
                        previousPage();
                    }}>{t(`ES_COMMON_CLEAR_ALL`)}</p>
                </SearchField>
            </SearchForm>
            {!isLoading &&
            <div>
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
                totalRecords={Count}
                disableSort={false}
                onLastPage={fetchLastPage}
                onFirstPage={fetchFirstPage}
                sortParams={[{id: getValues("sortBy"), desc: getValues("sortOrder") === "DESC" ? true : false}]}
            />}
            </div>}
        </React.Fragment>
}

export default OBPSSearchApplication