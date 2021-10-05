import React, {Fragment, useState} from "react"
import { InboxComposer, CaseIcon, SearchField, TextInput, FilterFormField, Loader } from "@egovernments/digit-ui-react-components";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const Inbox = () => {
    
    const { t } = useTranslation()

    const tenantId = Digit.ULBService.getCurrentTenantId();
    const [ searchPayloadInboxTable, setSearchPayload ] = useState()
    const [ filterPayloadInboxTable, setFilterPayload ] = useState()
    const { data: inboxData, isLoading: inboxLoading } = Digit.Hooks.events.useInbox(tenantId, {
        // limit: pageSize,
        // offset: pageOffset,
      },
      { eventTypes: "BROADCAST", status: "ACTIVE,INACTIVE" }, 
      {
        select: (data) => data?.events
      });
    
    const PropsForInboxLinks = {
        logoIcon: <CaseIcon />,
        headerText: "CS_COMMON_TEXT",
        links: [{
            text: "TL_NEW_APPLICATION",
            link: "/digit-ui/employee/engagement/messages/create",
            businessService: "TL",
            roles: ["TL_CEMP"],
          }]
    }

    const SearchFormFields = ({registerRef}) => {
        return <>
            <SearchField>
                <label>{t("EVENTS_ULB_LABEL")}</label>
                <TextInput name="ulb" inputRef={registerRef({})} />
            </SearchField>
            <SearchField>
                <label>{t("EVENTS_ULB_LABEL")}</label>
                <TextInput name="ulb2" inputRef={registerRef({})} />
            </SearchField>
            <SearchField>
                <label>{t("EVENTS_MESSAGE_LABEL")}</label>
                <TextInput name="message" inputRef={registerRef({})} />
            </SearchField>
        </>
    }

    const FilterFormFields = ({registerRef}) => {
        return <>
            <FilterFormField>
                <p>{t("ES_COMMON_SEARCH")}</p>
            </FilterFormField>
            {/* <CheckBox
                key={index + "service"}
                label={t(`CS_COMMON_INBOX_${e.businessservice.toUpperCase()}`)+" - "+t(`WF_NEWTL_${e.applicationstatus}`)+" "+`(${e.count})`}
                value={e.statusid}
                checked={checked}
                onChange={(event) => onServiceSelect(event, e.statusid)}
            /> */}
        </>
    }

    const searchFormDefaultValues = {
      // message: "AAAA"
    }

    const filterFormDefaultValues = {
        status: ["ACTIVE","INACTIVE"],
        eventTypes: "BROADCAST",  
    }

    const onSearchFormSubmit = (data) => {
        setSearchPayload(data)
        console.log("find search form data here", data)
        
    }
    
    const onFilterFormSubmit = (data) => {
        console.log("find search form data here", data)
    }

    const propsForSearchForm = { SearchFormFields, onSearchFormSubmit, searchFormDefaultValues }

    const propsForFilterForm = { FilterFormFields, onFilterFormSubmit, filterFormDefaultValues }

    const GetCell = (value) => <span className="cell-text styled-cell">{value}</span>;
    const GetStatusCell = (value) => value === "Active" ? <span className="sla-cell-success">{value}</span> : <span className="sla-cell-error">{value}</span> 
    
    const tableColumnConfig = React.useMemo(() => {
          return [
            {
              Header: t("EVENTS_MESSAGE_LABEL"),
              accessor: "message",
              Cell: ({ row }) => {
                return (
                  <div>
                    <span className="link">{row.original["description"]}</span>
                  </div>
                );
              },
            },
            {
              Header: t("EVENTS_POSTING_DATE_LABEL"),
              accessor: (row) => row?.auditDetails?.createdTime ? GetCell(format(new Date(row?.auditDetails?.createdTime), 'dd/MM/yyyy')) : ""
              },
            {
              Header: t("EVENTS_START_DATE_LABEL"),
              accessor: (row) => row?.eventDetails?.fromDate ? GetCell(format(new Date(row?.eventDetails?.fromDate), 'dd/MM/yyyy')) : "",
            },
            {
              Header: t("EVENTS_END_DATE_LABEL"),
              accessor: (row) => row?.eventDetails?.toDate ? GetCell(format(new Date(row?.eventDetails?.toDate), "dd/MM/yyyy")) : "",
            },
            {
              Header: t("EVENTS_POSTEDBY_LABEL"),
              accessor: row => GetCell(row?.user?.name || "")
            },
            {
              Header: t("EVENTS_STATUS_LABEL"),
              accessor: row => GetStatusCell(t(row?.status)),
            }
          ]
        })

        const propsForInboxTable = {
          getCellProps: (cellInfo) => {
            return {
                style: {
                minWidth: cellInfo.column.Header === t("ES_INBOX_APPLICATION_NO") ? "240px" : "",
                padding: "20px 18px",
                fontSize: "16px"
            }}},
            disableSort: false,
            autoSort:true,
            manualPagination:false,
            // initSortId="S N "
            // onPageSizeChange:onPageSizeChange,
            // currentPage: getValues("offset")/getValues("limit"),
            // onNextPage: nextPage,
            // onPrevPage: previousPage,
            pageSizeLimit: 10,
            // onSort: onSort,
            // sortParams: [{id: getValues("sortBy"), desc: getValues("sortOrder") === "DESC" ? true : false}],
            totalRecords: 100,
            // onSearch: "",
            // searchQueryForTable,
            data: inboxData,
            columns: tableColumnConfig
        }

    return inboxLoading ? <Loader/> : <InboxComposer {...{PropsForInboxLinks, ...propsForSearchForm, ...propsForFilterForm, propsForInboxTable}}>
        {/* <InboxPageLinks /> */}
        {/* <InboxSearchFields />
        <InboxFilterFields />
        <InboxTable /> */}
    </InboxComposer>
}

export default Inbox