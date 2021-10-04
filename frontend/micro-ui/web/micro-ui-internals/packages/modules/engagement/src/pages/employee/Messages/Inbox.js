import React, {Fragment} from "react"
import { InboxComposer, CaseIcon, SearchField, TextInput, FilterFormField, Loader } from "@egovernments/digit-ui-react-components";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

const Inbox = () => {
    
    const { t } = useTranslation()

    const tenantId = Digit.ULBService.getCurrentTenantId();

    const { data: inboxData, isLoading: inboxLoading } = Digit.Hooks.events.useInbox(tenantId, {
        // limit: pageSize,
        // offset: pageOffset,
      },
      { eventTypes: "BROADCAST", status: "ACTIVE,INACTIVE" }, 
      {
        select: (data) => data?.events
      });

    const { register: registerSearchFormField, control: controlSearchForm , handleSubmit: handleSearchFormSubmit, setValue: setSearchFormValue, getValues: gerSearchFormValue, reset: resetSearchForm } = useForm({
        defaultValues: {
            offset: 0,
            limit: 10,
            sortBy: "postingDate",
            sortOrder: "DESC",
        }
    })
    
    const { register: registerFilterFormField, control: controlFilterForm , handleSubmit: handleFilterFormSubmit, setValue: setFilterFormValue, getValues: gerFilterFormValue, reset: resetFilterForm } = useForm({
        defaultValues: {
            status: ["ACTIVE","INACTIVE"],
            eventTypes: "BROADCAST",            
        }
    })
    
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

    const SearchFormFields = () => {
        return <>
            <SearchField>
                <label>{t("EVENTS_ULB_LABEL")}</label>
                <TextInput name="ULB" inputRef={registerSearchFormField({})} />
            </SearchField>
        </>
    }

    const FilterFormFields = () => {
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

    const resetSearchFormDefaultValues = { 
        licenseNumbers: "", 
        mobileNumber: "", 
        fromDate: "",
        toDate: "",
        offset: 0,
        limit: 10,
        sortBy: "commencementDate",
        sortOrder: "DESC",
        status: "APPROVED",
        RenewalPending: true
    }

    const resetFilterFormDefaultValues = {
        status: ["ACTIVE","INACTIVE"],
        eventTypes: "BROADCAST",  
    }

    const onSearchFormSubmit = (data) => {
        console.log("find search form data here", data)
    }
    
    const onFilterFormSubmit = (data) => {
        console.log("find search form data here", data)
    }

    const propsForSearchForm = { SearchFormFields, onSearchFormSubmit, handleSearchFormSubmit, resetSearchForm, resetSearchFormDefaultValues }

    const propsForFilterForm = { FilterFormFields, onFilterFormSubmit, handleFilterFormSubmit, resetFilterForm, resetFilterFormDefaultValues }

    const GetCell = (value) => <span className="cell-text styled-cell">{value}</span>;

    const tableColumnConfig = React.useMemo(() => {
          return [
            {
              Header: t("EVENTS_EVENT_NAME_LABEL"),
              accessor: "name",
              Cell: ({ row }) => {
               
                return (
                  <div>
                    <span className="link">
                      <Link to={`${parentRoute}/event/${row.original.id}`}>{row.original["name"]}</Link>
                    </span>
                  </div>
                );
              },
            },
            {
              Header: t("EVENTS_EVENT_CATEGORY_LABEL"),
              accessor: (row) => {
               return GetCell(row?.eventCategory ? t(`MSEVA_EVENTCATEGORIES_${row?.eventCategory}`) : "")
              }
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

    return inboxLoading ? <Loader/> : <InboxComposer {...{PropsForInboxLinks, ...propsForSearchForm, ...propsForFilterForm, sourceData: inboxData, tableColumnConfig}}>
        {/* <InboxPageLinks /> */}
        {/* <InboxSearchFields />
        <InboxFilterFields />
        <InboxTable /> */}
    </InboxComposer>
}

export default Inbox