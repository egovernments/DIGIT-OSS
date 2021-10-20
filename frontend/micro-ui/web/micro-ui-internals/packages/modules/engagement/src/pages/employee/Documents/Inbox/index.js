import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "@egovernments/digit-ui-react-components";
import DesktopInbox from "../../../../components/Documents/DesktopInbox";
import MobileInbox from "../../../../components/Documents/MobileInbox";



const Inbox = ({ tenants }) => {
    const { t } = useTranslation()
    Digit.SessionStorage.set("ENGAGEMENT_TENANTS", tenants);
    const tenantId = Digit.ULBService.getCurrentTenantId();
    const [pageSize, setPageSize] = useState(10);
    const [pageOffset, setPageOffset] = useState(0);
    const [records, setRecords] = useState(100);
    const [searchParams, setSearchParams] = useState({
        tenantIds: tenantId,
        offset: pageOffset,
        limit: records
    });
    
    let isMobile = window.Digit.Utils.browser.isMobile();
    const { data: response, isLoading } = Digit.Hooks.engagement.useDocSearch(searchParams, {
        select: ({ Documents, totalCount }) => {
            const newData = { documentsList: Documents, totalCount };
            return newData;
        }
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
        setPageOffset((prevState) => prevState + pageSize);
        if (pageOffset > records- 10) {
            setRecords((prevRecords) => prevRecords + pageSize)
            setSearchParams((prevParams) => ({ ...prevParams, limit:records+pageSize, }))
        }
    }, [pageOffset, pageSize, records])

    const fetchPrevPage = () => {
        setPageOffset((prevState) => prevState - pageSize);
    };

    const handlePageSizeChange = (e) => {
        console.log(Number(e.target.value))
        setPageSize(Number(e.target.value));
    };

    useEffect(() => {
        setSearchParams((prevSearchParams) => ({ ...prevSearchParams, tenantIds: tenantId }))
    }, [])

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
                pageSizeLimit={pageSize}
                totalRecords={response?.documentsList?.length}
                title={"DOCUMENTS_DOCUMENT_HEADER"}
                iconName={"document"}
                links={links}
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