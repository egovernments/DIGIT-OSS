import React from "react";
import { useTable, useRowSelect, usePagination } from "react-table";
import { ArrowBack, ArrowForward } from "./svgindex";

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

const Table = ({ data, columns, getCellProps }) => {
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
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
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

  return (
    <React.Fragment>
      <table className="table" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
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
      <div className="pagination">
        Rows Per Page{":"}
        <select
          value={pageSize}
          style={{ marginRight: "15px" }}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
        <span>
          <span>
            {pageIndex * 10 + 1}
            {"-"}
            {(pageIndex + 1) * 10} of {rows.length}
          </span>{" "}
        </span>
        {/* <button style={{ marginLeft: "20px", marginRight: "20px" }} onClick={() => previousPage()} disabled={!canPreviousPage}>
          <span>

          </span>
        </button> */}
        {canPreviousPage && <ArrowBack onClick={() => previousPage()} />}
        {canNextPage && <ArrowForward onClick={() => nextPage()} />}
      </div>
    </React.Fragment>
  );
};

export default Table;
