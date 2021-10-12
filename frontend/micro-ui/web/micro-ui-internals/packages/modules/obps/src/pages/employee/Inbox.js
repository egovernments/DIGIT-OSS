import React, {Fragment, useCallback, useMemo, useReducer, useState} from "react"
import { InboxComposer, CaseIcon, SearchField, TextInput, FilterFormField, Loader, RadioButtons, Localities, RemoveableTag, Dropdown, CheckBox } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Controller } from "react-hook-form";

const Inbox = ({parentRoute}) => {
    
    const { t } = useTranslation()

    const tenantId = Digit.ULBService.getCurrentTenantId();

    const searchFormDefaultValues = {
      // mobileNumber: "",
      // applicationNumber
    }

    const filterFormDefaultValues = {
      moduleName: "bpa-services",
      businessService: {code: "BPA", name:t("BPA")},
      applicationStatus: "",
      locality: [],
      assignee: "ASSIGNED_TO_ALL"
    }
    const tableOrderFormDefaultValues = {
      sortBy: "",
      limit: 10,
      offset: 0,
      sortOrder: "DESC"
    }

    function formReducer(state, payload) {
      switch(payload.action){
        case "mutateSearchForm":
          Digit.SessionStorage.set("OBPS.INBOX", {...state, searchForm: payload.data})
          return {...state, searchForm: payload.data};
        case "mutateFilterForm":
          Digit.SessionStorage.set("OBPS.INBOX", {...state, filterForm: payload.data})
          return {...state, filterForm: payload.data};
        case "mutateTableForm":
          Digit.SessionStorage.set("OBPS.INBOX", {...state, tableForm: payload.data})
          return {...state, tableForm: payload.data};
        default:
          console.warn("dispatched action has nothing to reduce")
      }
    }
    const formInitValue = Digit.SessionStorage.get("OBPS.INBOX") || {
      filterForm: filterFormDefaultValues,
      searchForm: searchFormDefaultValues,
      tableForm: tableOrderFormDefaultValues
    }
    const [ formState, dispatch ] = useReducer(formReducer, formInitValue )
    const onPageSizeChange = (e) => {
      dispatch({action: "mutateTableForm", data: {...formState.tableForm , limit: e.target.value}})
    }
    const { isLoading: isInboxLoading, data: {table , statuses, totalCount} = {} } = Digit.Hooks.obps.useBPAInbox({
        // tenantId, moduleName, businessService, filters, config 
        tenantId,
        filters: { ...formState }
    });

    const PropsForInboxLinks = {
        logoIcon: <CaseIcon />,
        headerText: "CS_COMMON_OBPS",
        links: [{
            text: t("BPA_SEARCH_PAGE_TITLE"),
            link: "/digit-ui/employee/obps/search/application",
            businessService: "BPA",
            roles: ["BPAREG_EMPLOYEE", "BPAREG_APPROVER", "BPAREG_DOC_VERIFIER", "BPAREG_DOC_VERIFIER"],
          }]
    }

    const SearchFormFields = useCallback(({registerRef}) => {
        return <>
            <SearchField>
                <label>{t("REFERENCE_NO")}</label>
                <TextInput name="applicationNumber" inputRef={registerRef({})} />
            </SearchField>
            <SearchField>
                <label>{t("CORE_COMMON_MOBILE_NUMBER")}</label>
                <TextInput name="mobileNumber" inputRef={registerRef({})} />
            </SearchField>
        </>
    },[])
    const availableOptions = [
      { code: "ASSIGNED_TO_ME", name: `${t("ES_INBOX_ASSIGNED_TO_ME")}` },
      { code: "ASSIGNED_TO_ALL", name: `${t("ES_INBOX_ASSIGNED_TO_ALL")}` },
    ];

    const availableBusinessService = [
      {code: "BPA", name:t("BPA")},
      {code: "STAKEHOLDER", name:t("STAKEHOLDER")},
    ]

    const FilterFormFields = useCallback(({registerRef, controlFilterForm}) => {
        return <>
            <FilterFormField>
              <Controller
                name="assignee"
                defaultValue={availableOptions.filter((option) => option.code === formState?.filterForm?.assignee)[0]}
                control={controlFilterForm}
                render={(props) => <RadioButtons
                  onSelect={(e) => {
                    props.onChange(e.code)
                  }}
                  selectedOption={availableOptions.filter((option) => option.code === props.value)[0]}
                  optionsKey="name"
                  inputRef={registerRef({})}
                  options={availableOptions}
                />}
              />
            </FilterFormField>
            <FilterFormField>
              <Controller
                  name="businessService"
                  defaultValue={formState?.filterForm?.businessService}
                  control={controlFilterForm}
                  render={({ref, onChange, value}) => {
                    const [ businessService, setBusinessService] = useState(()=> value || [])
                    const renderRemovableTokens = useMemo(()=>{
                      // debugger
                      return (
                        <RemoveableTag
                          text={businessService.name}
                          onClick={() => {
                            setBusinessService()
                            onChange()
                          }}
                        />
                      )
                    },[businessService])
                    return <>
                      <div className="filter-label">{t("BPA_SEARCH_APPLICATION_TYPE_LABEL")}</div>
                      {/* <Dropdown option={localities} keepNull={true} selected={null} select={selectLocality} optionKey={"name"} /> */}
                      <Dropdown inputRef={ref} option={availableBusinessService} optionKey="name" t={t} select={ (e) => {
                          setBusinessService(e)
                          onChange(e)
                        }} selected={value} />
                      <div className="tag-container">
                        {renderRemovableTokens}
                      </div>
                    </>
                  }
                }
                />
            </FilterFormField>
            <FilterFormField>
              <Controller
                  name="locality"
                  defaultValue={formState?.filterForm?.locality}
                  control={controlFilterForm}
                  render={(props) => {
                    const [selectedLocalities, setSelectedLocalities] = useState(()=> props?.value || [])
                    const renderRemovableTokens = useMemo(()=>selectedLocalities?.map((locality, index) => {
                      return (
                        <RemoveableTag
                          key={index}
                          text={locality.i18nkey}
                          onClick={() => {
                            setSelectedLocalities(selectedLocalities?.filter((loc) => loc.code !== locality.code) )
                            props.onChange(selectedLocalities?.filter((loc) => loc.code !== locality.code))
                          }}
                        />
                      );
                    }),[selectedLocalities])
                    return <>
                      <div className="filter-label">{t("ES_INBOX_LOCALITY")}</div>
                      {/* <Dropdown option={localities} keepNull={true} selected={null} select={selectLocality} optionKey={"name"} /> */}
                      <Localities selectLocality={ (e) => {
                          setSelectedLocalities([e, ...selectedLocalities])
                          props.onChange([e, ...selectedLocalities])
                        } } tenantId={tenantId} boundaryType="revenue" />
                      <div className="tag-container">
                        {renderRemovableTokens}
                      </div>
                    </>
                  }
                }
                />
            </FilterFormField>
            <FilterFormField>
              <Controller
                name="applicationStatus"
                defaultValue={formState?.filterForm?.applicationStatus}
                control={controlFilterForm}
                render={(props) => {
                  const [selectedStatuses, setSelectedStatuses] = useState(()=> props?.value || [])
                  function changeItemCheckStatus(value){
                    props.onChange(value)
                    setSelectedStatuses(value)
                  }
                  const renderStatusCheckBoxes = useMemo(()=>statuses?.map( status => {
                    return <CheckBox
                      onChange={(e) => e.target.checked ? changeItemCheckStatus([...props.value, status?.statusid]) : changeItemCheckStatus(props.value?.filter( id => id !== status?.statusid)) }
                      checked={selectedStatuses?.includes(status?.statusid)}
                      label={t(status.applicationstatus)}
                    />}),[selectedStatuses])
                  return <>
                    {isInboxLoading ? <Loader /> : <>{renderStatusCheckBoxes}</>}
                  </>
                }}
              />
            </FilterFormField>
            {/* <FilterFormField>
                <p>{t("ES_COMMON_SEARCH")}</p>
            </FilterFormField> */}
            {/* <CheckBox
                key={index + "service"}
                label={t(`CS_COMMON_INBOX_${e.businessservice.toUpperCase()}`)+" - "+t(`WF_NEWTL_${e.applicationstatus}`)+" "+`(${e.count})`}
                value={e.statusid}
                checked={checked}
                onChange={(event) => onServiceSelect(event, e.statusid)}
            /> */}
        </>
    },[statuses])


    const onSearchFormSubmit = (data) => {
      dispatch({action: "mutateSearchForm", data})
      console.log("find search form data here", data)  
    }
    
    const onFilterFormSubmit = (data) => {
      // debugger
      dispatch({action: "mutateFilterForm", data})
      console.log("find search form data here", data)
    }

    const propsForSearchForm = { SearchFormFields, onSearchFormSubmit, searchFormDefaultValues }

    const propsForFilterForm = { FilterFormFields, onFilterFormSubmit, filterFormDefaultValues }

    const GetCell = (value) => <span className="cell-text styled-cell">{value}</span>;
    const GetStatusCell = (value) => value === "Active" ? <span className="sla-cell-success">{value}</span> : <span className="sla-cell-error">{value}</span> 
    
    const tableColumnConfig = useMemo(() => {
          return [
            {
              Header: t("TL_COMMON_TABLE_COL_APP_NO"),
              accessor: "applicationNumber",
              Cell: ({ row }) => {
                return (
                  <div>
                    <Link to={`${parentRoute}/bpa/${row.original["applicationId"]}`}>
                      <span className="link">{row.original["applicationId"]}</span>
                    </Link>
                  </div>
                );
              },
            },
            {
              Header: t("CS_APPLICATION_DETAILS_APPLICATION_DATE"),
              accessor: "applicationDate",
              Cell: ({row}) => row.original?.["date"] ? GetCell(format(new Date(row.original?.["date"]), 'dd/MM/yyyy')) : ""
              },
            {
              Header: t("ES_INBOX_LOCALITY"),
              accessor: (row) => t(row?.locality)
            },
            {
              Header: t("EVENTS_STATUS_LABEL"),
              accessor: row => t(`WF_${row?.businessService}_${row?.status}`),
            },
            {
              Header: t("WF_INBOX_HEADER_CURRENT_OWNER"),
              accessor: (row) => row?.owner,
            },
            {
              Header: t("WS_COMMON_TABLE_COL_APP_TYPE_LABEL"),
              accessor: (row) => row?.businessService,
            },
            {
              Header: t("ES_INBOX_SLA_DAYS_REMAINING"),
              accessor: row => GetStatusCell(row?.sla),
            }
          ]
        })

        const propsForInboxTable = useMemo(()=>{
          return {
            getCellProps: (cellInfo) => {
            return {
                style: {
                padding: "20px 18px",
                fontSize: "16px"
            }}},
            disableSort: false,
            autoSort:false,
            manualPagination:true,
            initSortI:"applicationDate",
            onPageSizeChange:onPageSizeChange,
            currentPage: formState.tableForm?.offset / formState.tableForm?.limit,
            onNextPage: () => dispatch({action: "mutateTableForm", data: {...formState.tableForm , offset: (parseInt(formState.tableForm?.offset) + parseInt(formState.tableForm?.limit)) }}),
            onPrevPage: () => dispatch({action: "mutateTableForm", data: {...formState.tableForm , offset: (parseInt(formState.tableForm?.offset) - parseInt(formState.tableForm?.limit)) }}),
            pageSizeLimit: formState.tableForm?.limit,
            // onSort: onSort,
            // sortParams: [{id: getValues("sortBy"), desc: getValues("sortOrder") === "DESC" ? true : false}],
            totalRecords: totalCount,
            onSearch: formState?.searchForm?.message,
            // globalSearch: {searchForItemsInTable},
            // searchQueryForTable,
            data: table,
            columns: tableColumnConfig
          }
        },[table, tableColumnConfig]) 

    return <InboxComposer {...{ isInboxLoading, PropsForInboxLinks, ...propsForSearchForm, ...propsForFilterForm, propsForInboxTable}}>
        {/* <InboxPageLinks /> */}
        {/* <InboxSearchFields />
        <InboxFilterFields />
        <InboxTable /> */}
    </InboxComposer>
}

export default Inbox