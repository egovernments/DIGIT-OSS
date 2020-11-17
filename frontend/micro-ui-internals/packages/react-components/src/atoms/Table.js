import React from "react";
import CheckBox from "./CheckBox";
import { useTable, useRowSelect } from "react-table";

const IndeterminateCheckbox = React.forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = React.useRef();
  const resolvedRef = ref || defaultRef;

  React.useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return (
    <React.Fragment>
      <input type="checkbox" ref={resolvedRef} {...rest} />
      {/* <CheckBox /> */}
    </React.Fragment>
  );
});

const Table = ({ data, columns, getCellProps, style }) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data,
    },
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: "selection",
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }) => <div>{<IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />}</div>,
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
              {/* <CheckBox /> */}
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );

  return (
    <table style={{ backgroundColor: "#fafafa", ...style }} {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th style={{ padding: "20px 18px", fontSize: "16px", textAlign: "left", verticalAlign: "middle" }} {...column.getHeaderProps()}>
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.slice(0, 10).map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return (
                  <td
                    style={{ padding: "20px 18px", fontSize: "16px", borderTop: "1px solid grey", textAlign: "left", verticalAlign: "middle" }}
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
  );
};

export default Table;
