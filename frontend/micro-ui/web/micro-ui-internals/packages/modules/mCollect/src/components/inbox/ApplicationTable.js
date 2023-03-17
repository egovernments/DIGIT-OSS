import React from "react";
import { Table } from "@egovernments/digit-ui-react-components";

const ApplicationTable = ({
  t,
  currentPage,
  columns,
  data,
  getCellProps,
  disableSort,
  onSort,
  onNextPage,
  onPrevPage,
  onFirstPage,
  onLastPage,
  onPageSizeChange,
  pageSizeLimit,
  sortParams,
  totalRecords,
  isPaginationRequired
}) => {
  return (
    <Table
      t={t}
      data={data}
      currentPage={currentPage}
      columns={columns}
      getCellProps={getCellProps}
      onNextPage={onNextPage}
      onPrevPage={onPrevPage}
      onLastPage={onLastPage}
      onFirstPage={onFirstPage}
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
