import React from "react";
import { Table } from "@egovernments/digit-ui-react-components";

const ApplicationTable = ({
  className = "table",
  t,
  currentPage,
  columns,
  data,
  getCellProps,
  disableSort,
  onSort,
  onNextPage,
  onPrevPage,
  onPageSizeChange,
  pageSizeLimit,
  sortParams,
  totalRecords,
  isPaginationRequired
}) => {
  return (
    <Table
      className={className}
      t={t}
      data={data}
      currentPage={currentPage}
      columns={columns}
      getCellProps={getCellProps}
      onNextPage={onNextPage}
      onPrevPage={onPrevPage}
      pageSizeLimit={pageSizeLimit}
      disableSort={disableSort}
      onPageSizeChange={onPageSizeChange}
      onSort={onSort}
      sortParams={sortParams}
      totalRecords={totalRecords}
      isPaginationRequired={isPaginationRequired}
    />
  );
};

export default ApplicationTable;
