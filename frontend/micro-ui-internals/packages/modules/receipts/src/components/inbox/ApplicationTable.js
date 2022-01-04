import { Table } from "@egovernments/digit-ui-react-components";
import React from "react";

const ApplicationTable = ({ t, columns, data, getCellProps, onNextPage, onPrevPage, currentPage, totalRecords, pageSizeLimit, onPageSizeChange, onLastPage, onFirstPage }) => (
  <Table
    t={t}
    data={data}
    manualPagination={true}
    columns={columns}
    getCellProps={getCellProps}
    onNextPage={onNextPage}
    onPrevPage={onPrevPage}
    currentPage={currentPage}
    totalRecords={totalRecords}
    onLastPage={onLastPage}
    onFirstPage={onFirstPage}
    onPageSizeChange={onPageSizeChange}
    pageSizeLimit={pageSizeLimit}
  />
);

export default ApplicationTable;
