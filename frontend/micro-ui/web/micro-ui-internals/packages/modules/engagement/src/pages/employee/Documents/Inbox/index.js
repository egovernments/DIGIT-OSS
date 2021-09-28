import React, { useEffect, useState } from "react";
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
    const [searchParams, setSearchParams] = useState({
        tenantIds: tenantId,
    });
    let isMobile = window.Digit.Utils.browser.isMobile();
    const { data: documentsList, isLoading } = Digit.Hooks.engagement.useDocSearch(searchParams, {
        limit: pageSize,
        offset: pageOffset,
        select: (data) => {
            return data?.Documents?.map((
                { uuid,
                    name,
                    category,
                    documentLink,
                    description,
                    postedBy,
                    tenantId
                }
            ) => ({
                id: uuid,
                name,
                category,
                documentLink,
                postedBy,
                tenantId,
                description
            }))
        }
    });

    const onSearch = (params) => {
        const tenantIds = params?.ulbs?.code;
        const { name, postedBy } = params;
        setSearchParams((prevSearchParams) => ({ ...prevSearchParams, name, postedBy, tenantIds }));
    }

    const handleFilterChange = (data) => {
        setSearchParams((prevSearchParams) => ({ ...prevSearchParams, ...data }));
    }

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

    useEffect(() => {
        setSearchParams((prevSearchParams) => ({ ...prevSearchParams, tenantIds: tenantId }))
    }, [])

    if (isMobile) {
        return (
            <MobileInbox
                data={documentsList}
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
            </Header>
            <DesktopInbox
                t={t}
                isLoading={isLoading}
                data={documentsList}
                links={links}
                searchParams={searchParams}
                onSearch={onSearch}
                //  globalSearch={globalSearch}
                searchFields={getSearchFields()}
                onFilterChange={handleFilterChange}
                pageSizeLimit={pageSize}
                totalRecords={documentsList?.length}
                title={"DOCUMENTS_DOCUMENT_HEADER"}
                iconName={"document"}
                links={links}
            />
        </div>
    );
}

export default Inbox;