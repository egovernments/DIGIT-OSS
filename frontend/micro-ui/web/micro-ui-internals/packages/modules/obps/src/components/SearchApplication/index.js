import React, { Fragment, useCallback, useMemo, useEffect, useState, useReducer } from "react"
import { useForm, Controller } from "react-hook-form";
import { CloseSvg, SearchForm, Table, Card, SearchAction, PopUp, SortAction, DetailsCard, Loader, Toast } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";
import { convertEpochToDateDMY } from  "../../utils";
import SearchFormFieldsComponent from "./SearchFormFieldsComponent";

const OBPSSearchApplication = ({tenantId, t, onSubmit, data, error, isLoading, Count }) => {
    const [ Applicationtype, setApplicationtype] = useState("BUILDING_PLAN_SCRUTINY");
    const [showToast, setShowToast] = useState(null);
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
            applicationType: Applicationtype?{code: Applicationtype,i18nKey: `BPA_APPLICATIONTYPE_${Applicationtype}`}:defaultAppType, 
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
    const [currPage, setCurrPage] = useState(getValues("offset")/getValues("limit"));

    useEffect(() => {
        if(error !== "")
        {
            //alert(t(error));
            setShowToast({ key: true, label: error });
        }
    },[error]);


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
    
    function getApplicationType(data){
        data && setApplicationtype(data.code || "BUILDING_PLAN_SCRUTINY");
        return data?data:defaultAppType;
    }

    function getselectedServiceType(data){
        if(data && serviceType && data?.code !== serviceType.code) data=serviceType;
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
            accessor: (row) => GetCell(row?.auditDetails?.createdTime ? convertEpochToDateDMY(row?.auditDetails?.createdTime) : ""),
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
          accessor: (row) => GetCell(row.businessService === "BPAREG"?row?.tradeLicenseDetail?.owners.map( o => o.name ). join(",") || "" : row?.landInfo?.owners.map( o => o.name ). join(",") || ""),
          disableSortBy: true,
        },
        {
          Header: t("BPA_STATUS_LABEL"),
          accessor: (row) =>GetCell(t(row?.state&&`WF_BPA_${row.state}`|| row?.status&&`WF_BPA_${row.status}`|| "NA") ),
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

    useEffect(() => {
        // setValue("offset",getValues("offset"));
        // setValue("limit",getValues("limit"));
        setCurrPage(getValues("offset")/getValues("limit"));
    },[getValues("offset"),getValues("limit")])

    const isMobile = window.Digit.Utils.browser.isMobile();

    if(isMobile){
        
        function activateModal(state, action){
            switch(action.type){
                case "set":
                    return action.payload
                case "remove":
                    return false
                default:
                    console.warn("no such action defined")
            }
        }

        const [ currentlyActiveMobileModal, setActiveMobileModal ] = useReducer(activateModal, false)

        const closeMobilePopupModal = () => {
            setActiveMobileModal({type:"remove"})
        }
    
        const MobilePopUpCloseButton = () => <div className="InboxMobilePopupCloseButtonWrapper" onClick={closeMobilePopupModal}>
            <CloseSvg/>
        </div>
    
        const MobileComponentDirectory= {
            SearchFormComponent: () => <SearchForm onSubmit={onSubmit} handleSubmit={handleSubmit} id="search-form" className="rm-mb form-field-flex-one inboxPopupMobileWrapper" >
                <MobilePopUpCloseButton/>
                <SearchFormFieldsComponent {...{Controller, register, control, t, getApplicationType, getselectedServiceType, applicationTypes, ServiceTypes}}/>
                {/* <SearchField className="submit">
                    <SubmitBar label={t("ES_COMMON_SEARCH")} submit form="search-form"/>
                    <p onClick={onResetSearchForm}>{t(`ES_COMMON_CLEAR_ALL`)}</p>
                </SearchField> */}
            </SearchForm>,
        }
    
        const CurrentMobileModalComponent = MobileComponentDirectory[currentlyActiveMobileModal]
        const propsMobileInboxCards = useMemo(() => data?.map((data) =>({
            [t("BPA_APPLICATION_NUMBER_LABEL")]: data.applicationNo,
            [t("BPA_COMMON_TABLE_COL_APP_DATE_LABEL")]: convertEpochToDateDMY(data.auditDetails?.createdTime) || "",
            [t("BPA_SEARCH_APPLICATION_TYPE_LABEL")]: data.additionalDetails?.applicationType || "-",
            [t("BPA_BASIC_DETAILS_SERVICE_TYPE_LABEL")]: data.additionalDetails?.serviceType,
            [t("BPA_CURRENT_OWNER_HEAD")]: data.landInfo?.owners.map( o => o.name ). join(",") || "",
            [t("BPA_STATUS_LABEL")]: data.state || "NA"
        })), [data])

        if(isLoading){
            return <Loader/>
        }
        return <React.Fragment>
            <div className="searchBox">
                <SearchAction text={t("ES_COMMON_SEARCH")} handleActionClick={() => setActiveMobileModal({type:"set", payload:"SearchFormComponent"})}/>
                {/* {isInboxLoading ? <Loader /> : <FilterAction text={t("ES_COMMON_FILTER")} handleActionClick={() => setActiveMobileModal({type:"set", payload:"FilterFormComponent"})}/>} */}
                <SortAction text={t("ES_COMMON_SORT")} handleActionClick={() => setActiveMobileModal({type:"set", payload:"SortComponent"})}/>
            </div>
            {currentlyActiveMobileModal ? <PopUp>
                <CurrentMobileModalComponent/>
            </PopUp> : null}
            {!isLoading && data?.[0]?.display ? <Card style={{ marginTop: 20 }}>
                {t(data?.[0]?.display)
                    .split("\\n")
                    .map((text, index) => (
                    <p key={index} style={{ textAlign: "center" }}>
                        {text}
                    </p>
                ))}
            </Card>
            : <DetailsCard {...{data:propsMobileInboxCards, linkPrefix: `/digit-ui/employee/obps/applicationNo/`, serviceRequestIdKey: "applicationNo" }} />}
        </React.Fragment>
    }

    return <React.Fragment>
            <SearchForm onSubmit={onSubmit} handleSubmit={handleSubmit}>
                <SearchFormFieldsComponent {...{Controller, register, control, t, getApplicationType, getselectedServiceType, applicationTypes, ServiceTypes}}/>
            </SearchForm>
            {!isLoading && data?.[0]?.display ? <Card style={{ marginTop: 20 }}>
                {
                t(data?.[0]?.display)
                    .split("\\n")
                    .map((text, index) => (
                    <p key={index} style={{ textAlign: "center" }}>
                        {text}
                    </p>
                    ))
                }
            </Card>
            : !isLoading?<Table
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
                //currentPage={getValues("offset")/getValues("limit")}
                currentPage={currPage}
                onNextPage={nextPage}
                onPrevPage={previousPage}
                pageSizeLimit={getValues("limit")}
                onSort={onSort}
                totalRecords={Count}
                disableSort={false}
                onLastPage={fetchLastPage}
                onFirstPage={fetchFirstPage}
                sortParams={[{id: getValues("sortBy"), desc: getValues("sortOrder") === "DESC" ? true : false}]}
            />:<Loader />}
            {showToast && (
        <Toast
          error={showToast.key}
          label={t(showToast.label)}
          onClose={() => {
            setShowToast(null);
          }}
        />
      )}
        </React.Fragment>
}

export default OBPSSearchApplication