import React from "react";
import { Card, Loader } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";

import EventLink from "../Events/EventLink";
import DocumentNotificationTable from "./DocumentNotificationTable";
import Search from "./Search";
import Filter from "./Filter";

const GetCell = (value) => <span className="cell-text styled-cell">{value}</span>;
const getDocumentCell = (value) => <span className="document-table-docs-columns"><a className="link" href={value} target="_blank">View</a></span>

const DocumentDesktopInbox = ({ isLoading, data, t, onSearch, title, iconName, links, globalSearch, searchFields, searchParams, onFilterChange, pageSizeLimit, totalRecords }) => {
  const columns = React.useMemo(() => [
    {
      Header: t('CE_TABLE_DOCUMENT_NAME'),
      accessor: (row) => GetCell(row?.name)
    },
    {
      Header: t('DOCUMENTS_CATEGORY_CARD_LABEL'),
      accessor: (row) => GetCell(row?.category ? t(`${row?.category}`) : "")
    },
    {
      Header: t('CE_TABLE_DOCUMENT_LINK'),
      accessor: (row) => getDocumentCell(row.documentLink)
    },
    {
      Header: t('CE_TABLE_DOCUMENT_POSTED_BY'),
      accessor: (row) => GetCell(row.postedBy)
    },

  ], [])

  let result;
  if (isLoading) {
    result = <Loader />;
  } else if (!data || data?.length === 0) {
    result = (
      <Card style={{ marginTop: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        {t("CE_DOCUMENTS_NOT_FOUND")}<br />
        <Link className="link" to={`/digit-ui/employee/engagement/documents/create`}>{t('NEW_DOCUMENT_TEXT')}</Link>
      </Card>
    );
  } else if (data?.length > 0) {
    result = (
      <DocumentNotificationTable
        t={t}
        data={data}
        columns={columns}
        globalSearch={globalSearch}
        onSearch={searchParams}
        pageSizeLimit={pageSizeLimit}
        totalRecords={totalRecords}
        getCellProps={(cellInfo) => {
          return {
            style: {
              minWidth: cellInfo.column.Header === t("CE_TABLE_DOCUMENT_NAME") ? "240px" : "",
              padding: "20px 18px",
              fontSize: "16px",
            },
          };
        }}
      />
    );
  }

  return (
    <div className="inbox-container">
      <div className="filters-container">
        <EventLink title={title} icon={iconName} links={links} />
        <div>
          <Filter onFilterChange={onFilterChange} searchParams={searchParams} />
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <Search
          t={t}
          onSearch={onSearch}
          type="desktop"
          searchFields={searchFields}
          isInboxPage={true}
          searchParams={searchParams}
        />
        <div className="result" style={{ marginLeft: "24px", flex: 1 }}>
          {result}
        </div>
      </div>
    </div>
  )
}

export default DocumentDesktopInbox;