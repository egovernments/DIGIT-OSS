import React,{useState} from 'react'
import { useTranslation } from "react-i18next";
import { format, isValid } from "date-fns";
import { Header } from "@egovernments/digit-ui-react-components";

import AllSurveys from '../../../components/Survey/AllSurveys';


const CitizenSurveys = ({tenants}) => {
    const { t } = useTranslation()
    Digit.SessionStorage.set("ENGAGEMENT_TENANTS", tenants);
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const [pageSize, setPageSize] = useState(10);
    const [pageOffset, setPageOffset] = useState(0);
    const [searchParams, setSearchParams] = useState({
      eventStatus: [],
      range: {
        startDate: null,
        endDate: new Date(""),
        title: ""
      }
    }); //replace this, after finding params for search and filter
    let isMobile = window.Digit.Utils.browser.isMobile();
    const { data, isLoading } = Digit.Hooks.events.useInbox(tenantId, {
      limit: pageSize,
      offset: pageOffset,
    },
    { eventTypes: "EVENTSONGROUND" }, 
    {
      select: (data) => data?.events
    });
  
    const onSearch = (params) => {
      setSearchParams({ ...searchParams, ...params });
    }
  
    const handleFilterChange = (data) => {
      setSearchParams({ ...searchParams, ...data })
    }
  
    const globalSearch = (rows, columnIds) => {
      // return rows;
      return rows?.filter(row =>
        (searchParams?.eventStatus?.length > 0 ? searchParams?.eventStatus?.includes(row.original?.status) : true) &&
        (searchParams?.eventName ? row.original?.name?.toUpperCase().startsWith(searchParams?.eventName.toUpperCase()) : true) &&
        (searchParams?.ulb?.code ? row.original.tenantId === searchParams?.ulb?.code : true) &&
        (searchParams?.eventCategory ? row.original.eventCategory === searchParams?.eventCategory?.code : true) &&
        (isValid(searchParams?.range?.startDate) ? row.original.eventDetails?.fromDate >= new Date(searchParams?.range?.startDate).getTime() : true) &&
        (isValid(searchParams?.range?.endDate) ? row.original.eventDetails?.toDate <= new Date(searchParams?.range?.endDate).getTime() : true))
    }
  
    const getSearchFields = () => {
      return [
        {
          label: t("EVENTS_ULB_LABEL"),
          name: "ulb",
          type: "ulb",
        },
        {
          label: t("SURVEY_NAME_LABEL"),
          name: "surveyName"
        },
        {
            label: t("POSTED_BY_LABEL"),
            name: "postedBy"
        }
      ]
    }

    const links = [
        {
            text: t("ES_TITLE_NEW_SURVEY"),
            link: "/digit-ui/employee/engagement/surveys/create",
        }
    ]
    return (
        <div>
            <Header>
                {t("SURVEY_SURVEYS_HEADER")}
                {Number(data?.length) ? <p className="inbox-count">{Number(data?.length)}</p> : null}
            </Header>
            <AllSurveys
                t={t}
                data={data}
                searchParams={searchParams}
                onSearch={onSearch}
                globalSearch={globalSearch}
                searchFields={getSearchFields()}
                onFilterChange={handleFilterChange}
                pageSizeLimit={pageSize}
                totalRecords={data?.length}
                title={"SURVEY_SURVEYS_TITLE"}
                iconName={"survey"}
                links={links}

            />
        </div>
    );
}

export default CitizenSurveys;
