import React from "react";
import { Card, Loader } from "@egovernments/digit-ui-react-components";
import { Link } from "react-router-dom";

import EventLink from "../Events/EventLink";
import DocumentNotificationTable from "./DocumentNotificationTable";
import Search from "./Search";
import Filter from "./Filter";
import { openDocumentLink, openUploadedDocument } from "../../utils";



const getDocumentDetailsPath = (document) => {
  return {
    pathname: `inbox/details/${document.name}`,
    state: { details: document }
  }

}

const GetCell = (value) => <span className="cell-text styled-cell">{value}</span>;
const getDocumentDetails = (value = "", link, t) => <span className="document-table-docs-columns"><Link className="link" to={link} >{value.length ? value : t('CE_DOCUMENT_TITLE')}</Link></span>
const getDocumentCell = (name = "mSeva", link, docLink, t) => (
  <span className="document-table-docs-columns" >
    {link?.length ? <span className="link" onClick={() => openUploadedDocument(link, name)} > {t('CE_DOCUMENT_VIEW_LINK')} </span> : null}
    {docLink.length ? <span className="link" onClick={() => openDocumentLink(docLink, name)}> {t('CE_DOCUMENT_OPEN_LINK')} </span> : null}
  </span>);


const DocumentDesktopInbox = ({ isLoading, data, t, onSearch, title, iconName, links, onSort, sortParams, globalSearch, searchFields, searchParams, onFilterChange, pageSizeLimit, totalRecords, currentPage, onNextPage, onPrevPage, onPageSizeChange }) => {
  const columns = React.useMemo(() => [
    {
      Header: t('CE_TABLE_DOCUMENT_NAME'),
      accessor: (row) => getDocumentDetails(row?.name, getDocumentDetailsPath(row), t),
    },
    {
      Header: t('DOCUMENTS_CATEGORY_CARD_LABEL'),
      accessor: (row) => GetCell(row?.category ? t(`${row?.category}`) : "")
    },
    {
      Header: t('CE_TABLE_DOCUMENT_LINK'),
      accessor: (row) => getDocumentCell(row?.name, row.filestoreId, row.documentLink || "", t)
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
        <Link className="link" to={`/${window?.contextPath}/employee/engagement/documents/inbox/new-doc`}>{t('NEW_DOCUMENT_TEXT')}</Link>
      </Card>
    );
  } else if (data?.length > 0) {
    result = (
      <DocumentNotificationTable
        t={t}
        data={data}
        columns={columns}
        onSort={onSort}
        sortParams={sortParams}
        globalSearch={globalSearch}
        onSearch={searchParams}
        pageSizeLimit={pageSizeLimit}
        totalRecords={totalRecords}
        currentPage={currentPage}
        onNextPage={onNextPage}
        onPrevPage={onPrevPage}
        onPageSizeChange={onPageSizeChange}
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