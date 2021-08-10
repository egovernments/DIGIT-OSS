import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import FilterListIcon from "@material-ui/icons/FilterList";
import { lighten } from "@material-ui/core/styles/colorManipulator";
import "./index.css";
import Label from "egov-ui-kit/utils/translationNode";

// let counter = 0;
// function createData(name, calories, fat, carbs, protein) {
//   counter += 1;
//   return { id: counter, name, calories, fat, carbs, protein };
// }

function getSorting(order, orderBy, sortOnObject) {
  if (orderBy == sortOnObject) {
    return order === "desc" ? (a, b) => (b[orderBy]['props']['children'] < a[orderBy]['props']['children'] ? -1 : 1) : (a, b) => (a[orderBy]['props']['children'] < b[orderBy]['props']['children'] ? -1 : 1);
  }
  return order === "desc" ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1) : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
}

class TableHeader extends React.Component {
  createSortHandler = (property) => (event) => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, rowCheckBox, columnData } = this.props;

    return (
      <TableHead>
        <TableRow>
          {rowCheckBox && (
            <TableCell padding="checkbox">
              <Checkbox indeterminate={numSelected > 0 && numSelected < rowCount} checked={numSelected === rowCount} onChange={onSelectAllClick} />
            </TableCell>
          )}
          {columnData.map((column) => {
            return (
              <TableCell
                key={column.id}
                numeric={column.numeric}
                padding={column.disablePadding ? "none" : "default"}
                sortDirection={orderBy === column.id ? order : false}
                className="tableHeadStyle"
              >
                <TableSortLabel
                  active={orderBy === column.id}
                  direction={order}
                  onClick={this.createSortHandler(column.id)}
                  className="table-tooltip-styles"
                >
                  {<Label label={column.label} />}
                </TableSortLabel>
              </TableCell>
            );
          }, this)}
        </TableRow>
      </TableHead>
    );
  }
}

TableHeader.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const toolbarStyles = (theme) => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === "light"
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  spacer: {
    flex: "1 1 100%",
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: "0 0 auto",
  },
});

let EnhancedTableToolbar = (props) => {
  const { numSelected, classes } = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subheading">
            {numSelected} selected
          </Typography>
        ) : (
            <Typography variant="title" id="tableTitle">
              Nutrition
          </Typography>
          )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton aria-label="Delete">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
            <Tooltip title="Filter list">
              <IconButton aria-label="Filter list">
                <FilterListIcon />
              </IconButton>
            </Tooltip>
          )}
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = (theme) => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    backgroundColor: "#f8f8f8",
  },
  table: {
    minWidth: 1020,
    backgroundColor: "#f8f8f8",
  },
  tableWrapper: {
    overflowX: "auto",
    backgroundColor: "#f8f8f8",
  },
});

class TableUi extends React.Component {
  constructor(props) {
    super(props);
    const { actionOnRow, orderby, sortOnObject = "" } = this.props;
    this.state = {
      order: "asc",
      orderBy: orderby,
      Action: actionOnRow,
      selected: [],
      page: 0,
      rowsPerPage: 5,
      sortOnObject: sortOnObject
    };
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }
    this.setState({ order, orderBy });
  };

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState((state) => ({ selected: state.data.map((n) => n.id) }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = (id) => this.state.selected.indexOf(id) !== -1;

  render() {
    const { classes, rowCheckBox, rowData, columnData, orderby, tableHeading } = this.props;
    const { order, selected, rowsPerPage, page, orderBy, sortOnObject } = this.state;
    const data = [...rowData];

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    return (
      <Paper className={classes.root}>
        {rowCheckBox && <EnhancedTableToolbar numSelected={selected.length} />}

        <div className={classes.tableWrapper}>
          <Table className={{ ...classes.table, tableStyle: "material-table" }} aria-labelledby="tableTitle">
            <TableHeader
              numSelected={selected.length}
              order={order}
              rowCheckBox={rowCheckBox}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
              columnData={columnData}
              className="table-header"
            />
            <TableBody>
              {data
                .sort(getSorting(order, orderBy, sortOnObject))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((n, index) => {
                  const isSelected = this.isSelected(n.id);
                  return (
                    <TableRow
                      hover
                      // onClick={(event) => this.handleClick(event, n.id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.id}
                      selected={isSelected}
                      className="material-table-row"
                    >
                      {rowCheckBox && (
                        <TableCell padding="checkbox">
                          <Checkbox checked={isSelected} />
                        </TableCell>
                      )}
                      {Object.values(n).map((i, ind) => {
                        return (
                          <TableCell key={ind} numeric>
                            {i}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            "aria-label": "Previous Page",
          }}
          nextIconButtonProps={{
            "aria-label": "Next Page",
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
          className="material-table-pagination"
        />
      </Paper>
    );
  }
}

TableUi.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TableUi);
