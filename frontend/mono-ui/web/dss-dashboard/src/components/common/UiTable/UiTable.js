import { Tooltip } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Arrow_Downward from '../../../images/arrows/Arrow_Downward.svg';
import Arrow_Upward from '../../../images/arrows/Arrow_Upward.svg';
import { convertLabelValue, getLocaleLabels } from '../../../utils/commons';
import ExportToExcel from '../ExportToExel';
import TableSearch from '../TableSearch/TableSearch';
import UiTableHead from './UiTableHead';
import styles from './UiTableStyles';

class EnhancedTable extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      order: this.props.order || 'asc',
      orderBy: this.props.orderBy,
      selected: this.props.selected || [],
      data: this.props.data,
      columnData: this.props.columnData,
      page: 0,
      rowsPerPage: 10,
      showExpand: -1,
      fieldTableData: {},
      tableData: this.props.data,
      initialLoad: false
    }
    this.openSideDrawer = this.openSideDrawer.bind(this)
    this.handleRequestSort = this.handleRequestSort.bind(this)
  }
  componentWillReceiveProps(nextProp) {
    if (nextProp.selected !== this.props.selected) {
      this.setState({
        selected: nextProp.selected
      })
    }
    if (nextProp.data !== this.props.data) {
      this.setState({
        // data: nextProp.data,
        page: 0,
        tableData: nextProp.data
      })
    }
  }

  getSorting(order, orderBy) {
    return order === 'desc'
      ? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
      : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1)
  }
  handleRequestSort = (event, property) => {
    const orderBy = property
    let order = 'desc'

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc'
    }
    if (order == 'asc' && !this.state.initialLoad) {
      this.setState({ order, orderBy, initialLoad: true })
    } else {
      this.setState({ order, orderBy })
    }
  }
  handleSelectAllClick = (event, checked) => {
    const { tableType } = this.props
    const { tableData } = this.state
    var selectedRows = []

  }

  handleClick = (event, id) => {
    const { selected } = this.state
    const selectedIndex = selected.indexOf(id)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1))
    }

    this.setState({ selected: newSelected })
    this.props.updateSelectedRows(newSelected)
  }
  isSelected = id => this.state.selected.indexOf(id) !== -1

  // handle button events
  openSideDrawer(g) {
    this.props.toggleSideDrawer(g)
  }
  handleChange12 = (panel, idx) => (event, expanded) => {
    this.setState({
      expanded: expanded ? idx : -1
    })
  }
  showFieldDetails(rowData, idx) {
    this.setState({
      fieldTableData: rowData,
      showExpand: idx === this.state.showExpand ? -1 : idx
    })
  }
  renderConfigTable(n, idx) {
    const { tableType } = this.props
    if (tableType === 'CENTERS_TABLE') {
      return this.renderCenterTable(n, idx)
    } else if (tableType === 'ULB') {
      return this.renderALLULBTable(n, idx)

    }
  }
  cellClick(row, event) {
    if (typeof this.props.cellClick === 'function') {
      this.props.cellClick(row);
    }
  }
  renderALLULBTable(n, idx) {
    const { classes, columnData, needHash } = this.props
    const isSelected = this.isSelected(n.Email)
    return (
      <TableRow
        hover
        // onClick={event => this.handleClick(event, n.Email)}
        role='checkbox'
        aria-checked={isSelected}
        tabIndex={-1}
        key={idx}
        selected={isSelected}
        className={classes.tBodyStyle}
      >
        {needHash ?
          <TableCell component="td" scope="row" className={classes.hashcolumn} data-title={"SN: "}>
            {this.state.page * this.state.rowsPerPage + idx + 1}
          </TableCell>
          : null
        }
        {_.keys(n).map(d => {
          if (n !== 'color') {
            return (
              <TableCell key={d}
                align="left"
                component='td' scope='row' data-title={d}>
                {d === 'status' ?
                  <div className={classes.progess}>
                    <div className={classes.progressLine} role="progressbar" style={{ width: n[d] + '%', backgroundColor: (n[d] > 50) ? "#259b24" : "#e54d42" }} aria-valuenow={n[d]} aria-valuemin={0} aria-valuemax={100} />
                  </div>
                  : n[d]
                }

              </TableCell>)
          }
        })}
      </TableRow>
    )
  }


  renderLastYearRowData(n, idx) {
    let items = [];

    {
      _.keys(n).map(d => {
        let value = Math.floor(Math.random() * Math.floor(89)) + 1;
        this.props.lyData.map((ly, i) => {
          _.keys(ly).map(dt => {
            if (typeof ly[dt] === 'object' && typeof n[d] === 'object') {
              if (ly[dt][0] === n[d][0]) {
                items = ly;
              }

            }
          })
        }
        )
      }
      )
    }
    return items;
  }
  convertToDateString(value, rowName) {
    if (rowName === 'Complaint Date') {
      return value && Number(value) && new Date(Number(value)).toLocaleDateString();
    }
    return getLocaleLabels(value);
  }

  getFilter(value) {
    switch (_.toUpper(value)) {
      case 'TODAY':
        return "yesterday";
      case 'WEEK':
        return "week";
      case 'MONTH':
        return "month";
      case 'QUARTER':
        return "quarter";

      default:
        return "year";
    }
  }

  renderCenterTable(n, idx) {
    const { classes, columnData, needHash } = this.props
    const isSelected = this.isSelected(n.Email);
    let lydata = this.renderLastYearRowData(n, idx);
    var existingFilters = this.props.filters;
    var title = existingFilters.duration.title;
    if (title.includes(',')) {
      title = 'CUSTOM';
    }
    var filterValue = this.getFilter(title);
    // let insightColor = data.insight_data ? data.insight_data.colorCode === "lower_red" ? "#e54d42" : "#259b24" : '';
    // 	let insightIcon = data.insight_data ? data.insight_data.colorCode === "lower_red" ? Arrow_Downward : Arrow_Upward : '';
    // 	let value = "";

    let colorCode = Math.floor(Math.random() * Math.floor(2))
    let insightColor = colorCode === 0 ? "#db534a" : "#2ba129";
    let insightIcon = colorCode === 0 ? Arrow_Downward : Arrow_Upward;
    let sign = colorCode === 0 ? '-' : '+';
    return (
      <TableRow
        hover
        // onClick={event => this.handleClick(event, n.Email)}
        role='checkbox'
        aria-checked={isSelected}
        tabIndex={-1}
        key={n.Email + '-' + idx}
        selected={isSelected}
        className={classes.tBodyStyle}
      >
        {needHash ?
          <TableCell component="td" scope="row" className={classes.hashcolumn} data-title={"SN: "}>
            {this.state.page * this.state.rowsPerPage + idx + 1}
          </TableCell>
          : null
        }
        {_.keys(n).map(d => {

          let value = Math.round(n[d].toString().replace(/[&\/\\#,%]/g, ''));
          if (value > 100) {
            value = 100;
          }
          insightColor = "#2ba129";
          insightIcon = Arrow_Upward;
          sign = '+';

          {
            _.keys(lydata).map(dt => {
              if (typeof n[d] !== 'object' && typeof lydata[dt] !== 'object' && (d === dt)) {
                var lyData = Math.round(lydata[dt].toString().replace(/[&\/\\#,%]/g, ''));
                var cyData = Math.round(n[d].toString().replace(/[&\/\\#,%]/g, ''));
                if (cyData === 0 && lyData === 0) {
                  value = 0;
                }
                else if (cyData == 0) {
                  value = lyData;
                  if (value > 100)
                    value = 100;

                  insightColor = "#db534a";
                  insightIcon = Arrow_Downward;
                  sign = '-';

                }
                else if (lyData == 0) {
                  value = cyData;
                  if (value > 100)
                    value = 100;

                  insightColor = "#2ba129";
                  insightIcon = Arrow_Upward;
                  sign = '+';
                }
                else {
                  value = Math.round(((cyData - lyData) / lyData) * 100);
                  if (value > 100)
                    value = 100;
                  if (value <= 0) {
                    insightColor = "#db534a";
                    insightIcon = Arrow_Downward;
                    sign = '-';
                  } else {
                    insightColor = "#2ba129";
                    insightIcon = Arrow_Upward;
                    sign = '+';
                  }

                }
              }
              value = value.toString().replace(/[-]/, '');
            }
            )
          }
          return (
            <TableCell key={d}
              align={((_.get(_.find(columnData, c => c.id === d), 'numeric') || false))
                /*    ? 'right' : 'left'}  to  make numbers to right align if needed */
                ? 'left' : 'left'}
              component='td' scope='row' data-title={d} >
              {title === 'CUSTOM' ?
                d === this.props.column ?
                  <span onClick={this.cellClick.bind(this, n)} className={classes.link}>{convertLabelValue(n[d][1])}</span>
                  : (typeof n[d] === 'object') ?

                    this.convertToDateString(n[d][1], d)
                    :
                    <div style={{ marginTop: "-8px", whiteSpace: "nowrap" }}>
                      <React.Fragment>
                        <span style={{ cursor: 'pointer' }}>
                          <span className={"table-value"}>{n[d]}</span>
                          <span style={{ marginLeft: "2vh", fontSize: 'initial', paddingRight: "8px" }}>
                          </span>
                        </span>

                      </React.Fragment>
                    </div>
                :
                d === this.props.column ?
                  <span onClick={this.cellClick.bind(this, n)} className={classes.link}>{convertLabelValue(n[d][1])}</span>
                  : (typeof n[d] === 'object') ?
                    this.convertToDateString(n[d][1], d)
                    :
                    <div style={{ marginTop: "-8px", whiteSpace: "nowrap" }}>
                      <React.Fragment>
                        <Tooltip title={`${sign}${value}% from last ${filterValue}`} placement="top" arrow classes={{ tooltip: classes.lightTooltip }}>
                          <span style={{ cursor: 'pointer' }}>
                            <span className={"table-value"}>{n[d]}</span>
                            <span style={{ marginLeft: "2vh", fontSize: 'initial', paddingRight: "8px" }}>
                              <img src={insightIcon} style={{ height: "12px", color: insightColor }} />
                            </span>
                            <span style={{ color: insightColor, fontSize: '14px' }}>{value < 10 ? ' ' : ''}{value}%</span>
                          </span>
                        </Tooltip>

                      </React.Fragment>
                    </div>
              }
            </TableCell>)


        }
        )}
      </TableRow>
    )
  }

  setFilteredList(newList) {
    this.setState({
      tableData: newList
    })
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
    // const { order, orderBy, rowsPerPage, page } = this.state
    // this.setState(
    //   { page: page + 1 }, () => {
    //     if (typeof this.props.callAPI === 'function') {
    //       this.props.callAPI({ page: page + 1, rowsPerPage, order, orderBy, needLastKey: true })
    //     }
    //   })
  }

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value, page: 0 });
    // const { order, orderBy, page } = this.state
    // let rowsPerPage = event.target.value

    // this.setState({ rowsPerPage: rowsPerPage }, state => {
    //   if (typeof this.props.callAPI === 'function') {
    //     this.props.callAPI({ page, rowsPerPage, order, orderBy })
    //   }
    // })
  }
  TablePaginationActions(props) {
  }

  render() {
    const { data, columnData, Gfilter, noPage, classes, tableType, needCheckBox, needHash, needSearch, needExport, excelName } = this.props
    // const { tableData, order, orderBy, selected } = this.state
    // const { data, columnData, totalCount, classes, tableType, needCheckBox, needHash, needSearch } = this.props;
    const { tableData, order, orderBy, totalCount = data.length, selected, rowsPerPage, page } = this.state;
    var columnType = _.chain(columnData).find(i => i.id === orderBy).get('numeric').value() || false;

    if (this.props.column && !this.state.initialLoad) {
      this.handleRequestSort(null, this.props.column);
      this.handleRequestSort(null, this.props.column);
    }

    let { strings } = this.props;
    let expData = _.cloneDeep(tableData);
    // iterate here for Excel download
    for (var i = 0; i < expData.length; i++) {
      if (typeof expData[i] === 'object') {
        for (var key in expData[i]) {
          if (typeof expData[i][key] === 'object') {
            expData[i][key] = expData[i][key][1]
          }
        }
      }
    }
    return (
      <Paper className={classes.root}>
        <div className={classes.downloadNsearch}>
          {needExport ? (
            <ExportToExcel
              data={expData}
              name={excelName}
            />
          ) : null}
          {needSearch ? (
            <TableSearch
              list={data}
              tableType={tableType}
              search={this.props.searchOnServer}
              updated={this.setFilteredList.bind(this)}
            />
          ) : null}
        </div>
        <div className={classes.tableDiv}>
          {
            <Table className={[classes.table, 'responsiveTable'].join(' ')} aria-labelledby='tableTitle'>
              <UiTableHead
                className={classes.thead}
                columnData={columnData}
                numSelected={selected.length}
                order={order}
                stickyHeader={true}
                orderBy={orderBy}
                Globfilter={Gfilter}
                onSelectAllClick={this.handleSelectAllClick}
                onRequestSort={this.handleRequestSort}
                rowCount={tableData.length}
                tableType={tableType}
                needCheckBox={needCheckBox}
                needHash={needHash}
                strings={strings}
              />
              {tableData && tableData.length > 0 ? (
                <TableBody className={classes.fontStyle}>
                  {/* "maintain orderby lodash" */}

                  {
                    _.orderBy(tableData, item => columnType ? parseFloat(_.get(item, orderBy) || 0) : (_.get(item, orderBy)), [order])
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((n, idx) => {
                        return this.renderConfigTable(n, idx)
                      })}
                </TableBody>
              ) : (
                  <TableBody>
                    <TableRow className={classes.tBodyStyle}>
                      <TableCell colSpan={columnData.length + 3} component='th' scope='row' data-title={'Actions: '}>
                        <h4 className={classes.alignCenter}>{strings["DSS_NO_DATA_AVAILABLE"] || "No Data Available"}</h4>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
            </Table>
          }


        </div>
        {!noPage && tableData && tableData.length >= 0 && (
          <TablePagination
            classes={{ menuItem: classes.pagination }}
            className={classes.pagination}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              'aria-label': 'Previous Page'
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page'
            }}
            //labelRowsPerPage="Showing"
            labelRowsPerPage={"Rows"}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
          // ActionsComponent={this.TablePaginationActions}
          />

        )}
      </Paper>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    strings: state.lang
  }
}

export default withRouter(withStyles(styles)(connect(mapStateToProps)(EnhancedTable)))
