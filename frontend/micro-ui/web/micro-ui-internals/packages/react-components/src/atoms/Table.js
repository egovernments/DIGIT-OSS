import React, { useEffect } from "react";
import { useGlobalFilter, usePagination, useRowSelect, useSortBy, useTable } from "react-table";
import { ArrowBack, ArrowForward, ArrowToFirst, ArrowToLast, SortDown, SortUp } from "./svgindex";

// const IndeterminateCheckbox = React.forwardRef(({ indeterminate, ...rest }, ref) => {
//   const defaultRef = React.useRef();
//   const resolvedRef = ref || defaultRef;
//   React.useEffect(() => {
//     resolvedRef.current.indeterminate = indeterminate;
//   }, [resolvedRef, indeterminate]);

//   return (
//     <React.Fragment>
//       <input type="checkbox" ref={resolvedRef} {...rest} />
//       {/* <CheckBox ref={resolvedRef} {...rest} /> */}
//     </React.Fragment>
//   );
// });

const noop = () => { };

const Table = ({
  className = "table",
  t,
  data,
  columns,
  getCellProps,
  currentPage = 0,
  pageSizeLimit = 10,
  disableSort = true,
  autoSort = false,
  initSortId = "",
  onSearch = false,
  manualPagination = true,
  totalRecords,
  onNextPage,
  onPrevPage,
  globalSearch,
  onSort = noop,
  onPageSizeChange,
  onLastPage,
  onFirstPage,
  sortParams = [],
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
    state: { pageIndex, pageSize, sortBy, globalFilter },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: currentPage, pageSize: pageSizeLimit, sortBy: autoSort ? [{ id: initSortId, desc: false }] : sortParams },
      pageCount: totalRecords > 0 ? Math.ceil(totalRecords / pageSizeLimit) : -1,
      manualPagination: manualPagination,
      disableMultiSort: false,
      disableSortBy: disableSort,
      manualSortBy: autoSort ? false : true,
      autoResetPage: false,
      autoResetSortBy: false,
      disableSortRemove: true,
      disableGlobalFilter: onSearch === false ? true : false,
      globalFilter: globalSearch || "text",
      useControlledState: (state) => {
        return React.useMemo(() => ({
          ...state,
          pageIndex: manualPagination ? currentPage : state.pageIndex,
        }));
      },
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect
    // (hooks) => {
    //   hooks.visibleColumns.push((columns) => [
    //     // Let's make a column for selection
    //     {
    //       id: "selection",
    //       // The header can use the table's getToggleAllRowsSelectedProps method
    //       // to render a checkbox
    //       Header: ({ getToggleAllRowsSelectedProps }) => <div>{<IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />}</div>,
    //       // The cell can use the individual row's getToggleRowSelectedProps method
    //       // to the render a checkbox
    //       Cell: ({ row }) => (
    //         <div>
    //           <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
    //           {/* <CheckBox /> */}
    //         </div>
    //       ),
    //     },
    //     ...columns,
    //   ]);
    // }
  );

  useEffect(() => {
    onSort(sortBy);
  }, [onSort, sortBy]);

  useEffect(() => setGlobalFilter(onSearch), [onSearch, setGlobalFilter]);
  return (
    <React.Fragment>
      <table className={className} {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())} style={{verticalAlign: "top"}} >
                  {column.render("Header")}
                  <span>{column.isSorted ? column.isSortedDesc ? <SortDown /> : <SortUp /> : ""}</span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            // rows.slice(0, 10).map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td
                      // style={{ padding: "20px 18px", fontSize: "16px", borderTop: "1px solid grey", textAlign: "left", verticalAlign: "middle" }}
                      {...cell.getCellProps([
                        // {
                        //   className: cell.column.className,
                        //   style: cell.column.style,
                        // },
                        // getColumnProps(cell.column),
                        getCellProps(cell),
                      ])}
                    >
                      {cell.column.link ? (
                        <a style={{ color: "#1D70B8" }} href={cell.column.to}>
                          {cell.render("Cell")}
                        </a>
                      ) : (
                        <React.Fragment> {cell.render("Cell")} </React.Fragment>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {
        <div className="pagination">
          {`${t("CS_COMMON_ROWS_PER_PAGE")} :`}
          <select
            className="cp"
            value={pageSize}
            style={{ marginRight: "15px" }}
            onChange={manualPagination ? onPageSizeChange : (e) => setPageSize(Number(e.target.value))}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
          <span>
            <span>
              {currentPage * pageSizeLimit + 1}
              {"-"}
              {(currentPage + 1) * pageSizeLimit > totalRecords ? totalRecords : (currentPage + 1) * pageSizeLimit}{" "}
              {totalRecords ? `of ${totalRecords}` : ""}
            </span>{" "}
          </span>
          {/* to go to first and last page we need to do a manual pagination , it can be updated later*/}
          {canPreviousPage && manualPagination && onFirstPage && <ArrowToFirst onClick={() => (manualPagination && onFirstPage())} className={"cp"} />}
          {canPreviousPage && <ArrowBack onClick={() => (manualPagination ? onPrevPage() : previousPage())} className={"cp"} />}
          {rows.length == pageSizeLimit && canNextPage && <ArrowForward onClick={() => (manualPagination ? onNextPage() : nextPage())} className={"cp"} />}
          {rows.length == pageSizeLimit && canNextPage && manualPagination && onLastPage && <ArrowToLast onClick={() => (manualPagination && onLastPage())} className={"cp"} />}
          {/* to go to first and last page we need to do a manual pagination , it can be updated later*/}
        </div>
      }
    </React.Fragment>
  );
};

export default Table;
