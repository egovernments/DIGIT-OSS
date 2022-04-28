import React from "react";
import MUIDataTable from "mui-datatables";
import get from "lodash/get";
import PropTypes from "prop-types";
import cloneDeep from "lodash/cloneDeep";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { LabelContainer } from "../../ui-containers";
import { getLocaleLabels, isPublicSearch } from "../../ui-utils/commons";
import "./index.css";

class Table extends React.Component {
  state = {
    data: [],
    columns: [],
    customSortOrder: "asc",
  };

  getExtraTableStyle = () => {
    const tableStyle = {
      MUIDataTableToolbar: {
        titleRoot: {
          fontSize: "18px",
          fontWeight: 600,
          color: "rgba(0, 0, 0, 0.87)",
        },
      },
      MUIDataTableHeadCell: {
        data: {
          fontSize: "14px !important",
          fontWeight: "600 !important",
          color: "rgba(0, 0, 0, 0.87) !important",
        },
      },
    };
    return isPublicSearch() ? tableStyle : {};
  };
  getMuiTheme = (ignoreFirstColumnHover) =>
    createMuiTheme({
      overrides: {
        MUIDataTableBodyCell: {
          root: {
            "&:nth-child(2)": {
              color:
                isPublicSearch() || ignoreFirstColumnHover
                  ? "rgba(0, 0, 0, 0.87)"
                  : "#2196F3",
              cursor:
                isPublicSearch() || ignoreFirstColumnHover ? "auto" : "pointer",
            },
          },
        },
        MuiTypography: {
          caption: {
            fontSize: "14px",
          },
        },
        MuiFormLabel: {
          root: {
            fontSize: "14px",
          },
        },
        MuiTableCell: {
          body: {
            fontSize: 14,
          },
        },
        MUIDataTableSearch: {
          main: {
            alignItems: "center",
          },
        },
        MuiIconButton: {
          root: {
            marginRight: "20px",
            width: "unset",
            height: "unset",
          },
        },
        mui: {
          tooltip: {
            height: "10px",
          },
        },
        ...this.getExtraTableStyle(),
      },
    });

  formatData = (data, columns) => {
    return (
      data &&
      [...data].reduce((acc, curr) => {
        let dataRow = [];
        // Object.keys(columns).forEach(column => {
        columns.forEach((column) => {
          // Handling the case where column name is an object with options
          column =
            typeof column === "object" ? get(column, "labelKey") : column;
          let columnValue = get(curr, `${column}`, "");
          if (get(columns, `${column}.format`, "")) {
            columnValue = columns[column].format(curr);
          }
          dataRow.push(columnValue);
        });
        let updatedAcc = [...acc];
        updatedAcc.push(dataRow);
        return updatedAcc;
      }, [])
    );
  };

  componentWillReceiveProps(nextProps) {
    const { data, columns } = nextProps;
    this.updateTable(data, columns);
  }

  componentDidMount() {
    const { data, columns } = this.props;
    this.updateTable(data, columns);
  }

  getTranslatedHeader = (columns) => {
    if (columns) {
      columns.map((item, key) => {
        columns[key].name = (
          <LabelContainer labelKey={item.labelKey} labelName={item.labelKey} />
        );
      });
      return columns;
    }
  };

  updateTable = (data, columns) => {
    // const updatedData = this.formatData(data, columns);
    // Column names should be array not keys of an object!
    // This is a quick fix, but correct this in other modules also!
    let fixedColumns = Array.isArray(columns) ? columns : Object.keys(columns);
    const updatedData = this.formatData(data, fixedColumns);
    this.setState({
      data: updatedData,
      // columns: Object.keys(columns)
      columns: this.getTranslatedHeader(fixedColumns),
    });
  };

  onColumnSortChange = (columnName, i) => {
    let { customSortOrder, data } = this.state;
    const { customSortColumn } = this.props;
    const { column, sortingFn } = customSortColumn;
    if (columnName === column) {
      const updatedData = sortingFn(cloneDeep(data), "", customSortOrder);
      this.setState({
        data: updatedData.data,
        customSortOrder: updatedData.currentOrder,
      });
    }
  };

  getLabelContainer = (labelKey, labelName) => {
    return <LabelContainer labelKey={labelKey} labelName={labelName} />;
  };

  getTableTextLabel = () => {
    const textLabels = {
      body: {
        noMatch: this.getLabelContainer(
          "COMMON_TABLE_NO_RECORD_FOUND",
          "Sorry, no matching records found"
        ),
        toolTip: this.getLabelContainer("COMMON_TABLE_SORT", "Sort"),
      },
      pagination: {
        next: this.getLabelContainer("COMMON_TABLE_NEXT_PAGE", "Next Page"),
        previous: this.getLabelContainer(
          "COMMON_TABLE_PREVIOUS_PAGE",
          "Previous Page"
        ),
        rowsPerPage: this.getLabelContainer(
          "COMMON_TABLE_ROWS_PER_PAGE",
          "Rows per page:"
        ),
        // displayRows: this.getLabelContainer("COMMON_TABLE_OF", "of")
      },
      toolbar: {
        search: this.getLabelContainer("COMMON_TABLE_SEARCH", "Search"),
        downloadCsv: this.getLabelContainer(
          "COMMON_TABLE_DOWNLOAD_CSV",
          "Download CSV"
        ),
        print: this.getLabelContainer("COMMON_TABLE_PRINT", "Print"),
        viewColumns: this.getLabelContainer(
          "COMMON_TABLE_VIEW_COLUMNS",
          "View Columns"
        ),
        filterTable: this.getLabelContainer(
          "COMMON_TABLE_FILTER",
          "Filter Table"
        ),
      },
      filter: {
        all: this.getLabelContainer("COMMON_TABLE_ALL", "All"),
        title: this.getLabelContainer("COMMON_TABLE_FILTERS", "FILTERS"),
        reset: this.getLabelContainer("COMMON_TABLE_RESET", "RESET"),
      },
      viewColumns: {
        title: this.getLabelContainer(
          "COMMON_TABLE_SHOW_COLUMNS",
          "Show Columns"
        ),
        titleAria: this.getLabelContainer(
          "COMMON_TABLE_SHOW_HIDE_TABLE",
          "Show/Hide Table Columns"
        ),
      },
    };
    return textLabels;
  };

  getTabelTitle = (title) => {
    return getLocaleLabels(title.labelName, title.labelKey);
  };

  render() {
    const { data, columns } = this.state;
    const { options, title, rows, customSortDate } = this.props;
    const { ignoreFirstColumnHover = false } = options;
    options.textLabels = this.getTableTextLabel();
    return (
      <MuiThemeProvider theme={this.getMuiTheme(ignoreFirstColumnHover)}>
        <MUIDataTable
          title={this.getTabelTitle(title) + " (" + rows + ")"}
          data={data}
          columns={columns}
          options={{
            ...options,
            onColumnSortChange: (columnName, order) =>
              this.onColumnSortChange(columnName, order),
          }}
        />
      </MuiThemeProvider>
    );
  }
}

Table.propTypes = {
  columns: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  options: PropTypes.object.isRequired,
};

export default Table;
