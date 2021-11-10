import React from "react";
import { Table } from "@egovernments/digit-ui-react-components";

const DocumentNotificationTable = ({
  t,
  data,
  columns,
  globalSearch,
  onSearch,
  getCellProps,
  pageSizeLimit,
  totalRecords,
  currentPage,
  onNextPage,
  onPrevPage,
  onPageSizeChange,
  onSort,
  sortParams
}) => {
  return (
    <Table
      t={t}
      data={data}
      columns={columns}
      onSearch={onSearch}
      globalSearch={globalSearch}
      manualGlobalFilter={true}
      manualPagination={true}
      currentPage={currentPage}
      onNextPage={onNextPage}
      onPrevPage={onPrevPage}
      pageSizeLimit={pageSizeLimit}
      onPageSizeChange={onPageSizeChange}
      getCellProps={getCellProps}
      totalRecords={totalRecords}
      onSort={onSort}
      sortParams={sortParams}
    />
  )
}

export default DocumentNotificationTable;
