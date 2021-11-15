import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@egovernments/digit-ui-react-components";
import DesktopInbox from "../../../../components/Documents/DesktopInbox";
import MobileInbox from "../../../../components/Documents/MobileInbox";



const Inbox = ({ tenants }) => {
    const { t } = useTranslation()
    Digit.SessionStorage.set("ENGAGEMENT_TENANTS", tenants);
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const [searchParams, setSearchParams] = useState({
        tenantIds: tenantId,
        offset: 0,
        limit: 10
    });

    let isMobile = window.Digit.Utils.browser.isMobile();
    const { data: response, isLoading } = Digit.Hooks.engagement.useDocSearch(searchParams, {
        select: ({ Documents, totalCount }) => ({ documentsList: Documents, totalCount })

    });

    const onSearch = (params) => {
        const tenantIds = params?.ulbs?.code?.length ? params?.ulbs?.code : tenantId
        const { name, postedBy } = params;
        setSearchParams((prevSearchParams) => ({ ...prevSearchParams, name, postedBy, tenantIds }));
    }

    const handleFilterChange = (data) => {
        setSearchParams((prevSearchParams) => ({ ...prevSearchParams, ...data }));
    }

    const fetchNextPage = useCallback(() => {
        setSearchParams((prevSearchParams) => ({...prevSearchParams, offset: (parseInt(prevSearchParams?.offset) + parseInt(prevSearchParams?.limit))}));
        
    }, [])

    const fetchPrevPage = () => {
        setSearchParams((prevSearchParams) => ({...prevSearchParams, offset: (parseInt(prevSearchParams?.offset) - parseInt(prevSearchParams?.limit))}));
    };

    const handlePageSizeChange = (e) => {
        setSearchParams((prevSearchParams) => ({...prevSearchParams, limit:e.target.value}));
    };

    useEffect(() => {
        setSearchParams((prevSearchParams) => ({ ...prevSearchParams, tenantIds: tenantId }))
    }, [tenantId])

    const getSearchFields = () => {
        return [
            {
                label: t('LABEL_FOR_ULB'),
                name: "ulbs",
                type: "ulb",
            },
            {
                label: t('DOCUMENTS_DOCUMENT_HEADER'),
                name: "name"
            },
            {
                label: t('CE_TABLE_DOCUMENT_POSTED_BY'),
                name: "postedBy"
            }
        ]
    }

    const links = [
        {
            text: t('NEW_DOCUMENT_TEXT'),
            link: "/digit-ui/employee/engagement/documents/inbox/new-doc",
        }
    ]
    if (isMobile) {
        return (
            <MobileInbox
                data={response?.documentsList}
                searchParams={searchParams}
                searchFields={getSearchFields()}
                t={t}
                onFilterChange={handleFilterChange}
                onSearch={onSearch}
                isLoading={isLoading}
                title={"DOCUMENTS_DOCUMENT_HEADER"}
                iconName={"document"}
                links={links}
            />
        )
    }

    return (
        <div>
            <Header>
                {t("DOCUMENTS_DOCUMENT_HEADER")}
                {Number(response?.totalCount) ? <p className="inbox-count">{Number(response?.totalCount)}</p> : null}
            </Header>

            <DesktopInbox
                t={t}
                isLoading={isLoading}
                data={response?.documentsList}
                links={links}
                searchParams={searchParams}
                onSearch={onSearch}
                //  globalSearch={globalSearch}
                searchFields={getSearchFields()}
                onFilterChange={handleFilterChange}
                pageSizeLimit={searchParams?.limit}
                totalRecords={response?.totalCount}
                title={"DOCUMENTS_DOCUMENT_HEADER"}
                iconName={"document"}
                links={links}
                currentPage={parseInt(searchParams.offset / searchParams.limit)}
                onNextPage={fetchNextPage}
                onPrevPage={fetchPrevPage}
                onPageSizeChange={handlePageSizeChange}
            //onSort={handleSortBy}
            //sortParams={sortParams}
            />

        </div>
    );
}

export default Inbox;