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
      manualPagination={false}
      pageSizeLimit={pageSizeLimit}
      getCellProps={getCellProps}
      totalRecords={totalRecords}
      onSort={onSort}
      sortParams={sortParams}
    />
  )
}

export default DocumentNotificationTable;
