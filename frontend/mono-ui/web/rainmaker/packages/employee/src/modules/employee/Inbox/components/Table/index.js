import Hidden from "@material-ui/core/Hidden";
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from "@material-ui/core/TableHead";
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from "@material-ui/core/TableRow";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import FirstPageIcon from '@material-ui/icons/FirstPage';
import ImportExportIcon from "@material-ui/icons/ImportExport";
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import { Card } from "components";
import commonConfig from "config/common.js";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { addWflowFileUrl, orderWfProcessInstances } from "egov-ui-framework/ui-utils/commons";
import { setRoute, toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { httpRequest } from "egov-ui-kit/utils/api";
import { getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import Label from "egov-ui-kit/utils/translationNode";
import { TaskDialog } from "egov-workflow/ui-molecules-local";
import get from "lodash/get";
import PropTypes from 'prop-types';
import React from "react";
import { connect } from "react-redux";
import "./index.css";
import { getWFConfig } from "./workflowRedirectionConfig";
import Tooltip from '@material-ui/core/Tooltip';

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5,
  },
});

class TablePaginationActions extends React.Component {
  handleFirstPageButtonClick = event => {
    this.props.onChangePage(event, 0);
  };

  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1);
  };

  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1);
  };

  handleLastPageButtonClick = event => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
    );
  };

  render() {
    const { classes, count, page, rowsPerPage, theme } = this.props;

    return (
      <div className={classes.root}>
        <Hidden only={["xs"]}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="First Page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        </Hidden>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <Hidden only={["xs"]}>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
        </Hidden>
      </div>
    );
  }
}

TablePaginationActions.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired,
};

const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(
  TablePaginationActions,
);
const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 500,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  tableRow: {
    display: 'flex'
  }
});
class InboxData extends React.Component {
  state = {
    dialogOpen: false,
    workflowHistory: [],
    sortOrder: "asc",
    isSorting: false,
    wfSlaConfig: [],
    page: 0,
    rowsPerPage: 0,
    rowsPerPageOptions: []
  };

  componentDidMount = async () => {
    let mdmsBody = {
      MdmsCriteria: {
        tenantId: commonConfig.tenantId,
        moduleDetails: [
          {
            moduleName: "common-masters",
            masterDetails: [
              {
                name: "wfSlaConfig"
              },
              {
                name: "TablePaginationOptions"
              }
            ]
          }
        ]
      }
    };
    try {
      const payload = await httpRequest(
        "/egov-mdms-service/v1/_search",
        "_search",
        [],
        mdmsBody
      );
      if (payload) {
        this.setState({
          wfSlaConfig: get(payload.MdmsRes, "common-masters.wfSlaConfig"),
          rowsPerPage: get(payload.MdmsRes, "common-masters.TablePaginationOptions[0].defaultValue",100),
          rowsPerPageOptions: get(payload.MdmsRes, "common-masters.TablePaginationOptions[0].rowsPerPageOptions",[25,50,100])
        })
      }
    } catch (e) {
    }
  }

  getProcessIntanceData = async (pid) => {
    const tenantId = getTenantId();
    const queryObject = [
      { key: "businessIds", value: pid },
      { key: "history", value: true },
      { key: "tenantId", value: tenantId },
    ];
    const payload = await httpRequest("egov-workflow-v2/egov-wf/process/_search?", "", queryObject);
    const processInstances = payload && payload.ProcessInstances.length > 0 && orderWfProcessInstances(payload.ProcessInstances);
    return processInstances;
  };

  onHistoryClick = async (moduleNumber) => {
    const { toggleSnackbarAndSetText, prepareFinalObject } = this.props;
    const processInstances = await this.getProcessIntanceData(moduleNumber.text);
    let exclamationMarkIndex;
    if (processInstances && processInstances.length > 0) {
      processInstances.map((data, index) => {
        if (data.assigner && data.assigner.roles && data.assigner.roles.length > 0) {
          data.assigner.roles.map(role => {
            if (role.code === "AUTO_ESCALATE") return exclamationMarkIndex = index - 1;
          })
        }
      });
      if (exclamationMarkIndex) processInstances[exclamationMarkIndex].isExclamationMark = true;
    }

    if (processInstances && processInstances.length > 0) {
      await addWflowFileUrl(processInstances, prepareFinalObject);
      this.setState({
        dialogOpen: true,
      });
    } else {
      toggleSnackbarAndSetText(true, {
        labelName: "API error",
        labelKey: "ERR_API_ERROR",
      });
    }
  };

  onDialogClose = () => {
    this.setState({
      dialogOpen: false,
    });
  };

  getModuleLink = async (item, row, index) => {
    window.scrollTo(0, 0);
    const status = row[2].text && row[2].text.props.defaultLabel;
    const taskId = index === 0 && item.text;
    const tenantId = getTenantId();
    // const processInstances = await this.getProcessIntanceData(row[0].text);
    // if (processInstances && processInstances.length > 0) {
    //   await addWflowFileUrl(processInstances, prepareFinalObject);
    // }
    let contextPath = status === "Initiated" ? getWFConfig(row[0].hiddenText, row[0].subtext).INITIATED : getWFConfig(row[0].hiddenText, row[0].subtext).DEFAULT;
    let queryParams = `applicationNumber=${taskId}&tenantId=${tenantId}`;
    if (row[0].subtext === "PT.CREATE" ) {
      queryParams += '&type=property';
    } else if (row[0].subtext === "PT.UPDATE" ) {
      queryParams += '&type=updateProperty';
    } 
    else if (row[0].subtext === "PT.LEGACY") {
      queryParams += '&type=legacy';
    }
    else if (row[0].subtext === "ASMT") {
      queryParams += '&type=assessment';
    }
    else if (row[0].subtext === "NewWS1") {
      queryParams += '&history=true&service=WATER';
    }
    else if (row[0].subtext === "NewSW1") {
      queryParams += '&history=true&service=SEWERAGE';
    }
    else if (row[0].subtext === "ModifyWSConnection") {
      queryParams += '&history=true&service=WATER&mode=MODIFY';
    }
    this.props.setRoute(`${contextPath}?${queryParams}`);
  };

  getSlaColor = (sla, businessService) => {
    const { businessServiceSla } = this.props;
    const { wfSlaConfig } = this.state;
    const MAX_SLA = businessServiceSla[businessService];
    if (wfSlaConfig) {
      // if ((MAX_SLA - (MAX_SLA * wfSlaConfig[0].slotPercentage / 100) <= sla) && sla <= MAX_SLA) {
      if ((MAX_SLA - (MAX_SLA * wfSlaConfig[0].slotPercentage / 100) <= sla)) {
        return wfSlaConfig[0].positiveSlabColor;
      } else if (0 < sla && sla < MAX_SLA - (MAX_SLA * wfSlaConfig[0].slotPercentage / 100)) {
        return wfSlaConfig[0].middleSlabColor;
      } else {
        return wfSlaConfig[0].negativeSlabColor;
      }
    }
  };

  sortingTable = (order) => {
    const { sortOrder } = this.state;
    if (sortOrder !== order) {
      this.setState({
        sortOrder: order,
        isSorting: true,
      });
      this.props.data.rows=this.props.data.rows.reverse();
    }
  };
  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  render() {
    const { data={rows:[],headers:[]}, ProcessInstances, classes ,remainingDataLoading} = this.props;
    const { onHistoryClick, onDialogClose, getModuleLink } = this;
    const { isSorting, sortOrder } = this.state;
    const { rows, rowsPerPage, page, rowsPerPageOptions } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data&&data.rows&&data.rows.length - page * rowsPerPage);

    if (isSorting) {
      // data.rows.reverse();
    }
    return (
      <div>
        <Hidden only={["xs"]}>
          <Table>
            <TableHead style={{ backgroundColor: "white", borderBottom: "1px solid rgb(211, 211, 211)" }}>
              <TableRow>
                {data&&data.headers&&data.headers.map((item, index) => {
                  let classNames = `inbox-data-table-headcell inbox-data-table-headcell-${index}`;
                  return (
                    <TableCell className={classNames}>
                      {index === 4 ? (
                        <div className="rainmaker-displayInline">
                          {sortOrder === "desc" && (
                            <div className="arrow-icon-style" onClick={() => this.sortingTable("asc")}>
                              <Label label={item} labelStyle={{ fontWeight: "500", marginTop: "-5px", minWidth: "150px" }} color="#000000" />
                              <ArrowDropUpIcon style={{ marginTop: "-3px" }} />
                            </div>
                          )}
                          {sortOrder === "asc" && (
                            <div className="arrow-icon-style" onClick={() => this.sortingTable("desc")}>
                              <Label label={item} labelStyle={{ fontWeight: "500", marginTop: "-5px", minWidth: "150px" }} color="#000000" />
                              <ArrowDropDownIcon style={{ marginTop: "-3px" }} />
                            </div>
                          )}
                        </div>
                      ) : (
                          <Label label={item} labelStyle={{ fontWeight: "500" }} color="#000000" />
                        )}
                    </TableCell>
                  );
                })}
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            {data.rows.length === 0 ? (
              <TableBody>
                {!remainingDataLoading&&<Label labelClassName="" label="COMMON_INBOX_NO_DATA" />}
              </TableBody>
            ) : (
                <TableBody>
                  {data.rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, i) => {
                    return (
                      <TableRow key={i} className="inbox-data-table-bodyrow">
                        {row.map((item, index) => {
                          let classNames = `inbox-data-table-bodycell inbox-data-table-bodycell-${index}`;
                          if (item.subtext) {
                            return (
                              <TableCell className={classNames}>
                                <div onClick={() => getModuleLink(item, row, index)} className="inbox-cell-text">
                                  {<a style={{ color: "#FE7A51" }}>{item.text} </a>}
                                </div>
                                <div className="inbox-cell-subtext">
                                  {<Label label={`CS_COMMON_INBOX_${item.subtext.toUpperCase()}`} color="#000000" />}
                                </div>
                              </TableCell>
                            );
                          } else if (item.badge) {
                            return (
                              <TableCell className={classNames}>
                                <div style= {item.isEscalatedApplication ? {width: "80%", display: "flex", justifyContent: "space-between"}: {}}>
                                  <span class={"inbox-cell-badge-primary"} style={{ backgroundColor: this.getSlaColor(item.text, row[2].text.props.label.includes("AIRPORT_NOC_OFFLINE") ? "AIRPORT_NOC_OFFLINE" : row[2].text.props.label.includes("FIRE_NOC_SRV") ? "FIRE_NOC_SRV" : row[2].text.props.label.split("_")[1]) }}>{item.text}</span>
                                    {item.isEscalatedApplication ?
                                    <Tooltip title="Escalated" placement="top">
                                      <span> <i class="material-icons" style={{color: "rgb(244, 67, 54)"}}>error</i> </span>
                                    </Tooltip>
                                    : ""}
                                </div>
                              </TableCell>
                            );
                          } else if (item.historyButton) {
                            return (
                              <TableCell className={classNames}>
                                <div onClick={() => onHistoryClick(row[0])} style={{ cursor: "pointer" }}>
                                  <i class="material-icons">history</i>
                                </div>
                              </TableCell>
                            );
                          } else {
                            return (
                              <TableCell className={classNames}>
                                <div>{item.text}</div>
                              </TableCell>
                            );
                          }
                        })}
                      </TableRow>
                    );
                  })}
                  <TaskDialog open={this.state.dialogOpen} onClose={onDialogClose} history={ProcessInstances} />
                </TableBody>

              )}
            {/* {emptyRows > 0 && (
                <TableRow style={{ height: 48 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )} */}
            {!remainingDataLoading&&<TableFooter>
              <TablePagination
                rowsPerPageOptions={rowsPerPageOptions}
                count={data.rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                labelRowsPerPage={<Label labelClassName="" label="COMMON_INBOX_ROWS_LABEL" />}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActionsWrapped}
              />
            </TableFooter>}
          </Table>
        </Hidden>
        <Hidden only={["sm", "md", "lg", "xl"]} implementation="css">
          <div class="sort-icon-flex">
            {sortOrder === "asc" && (
              <div className="rainmaker-displayInline" onClick={() => this.sortingTable("desc")}>
                <ImportExportIcon />
                <Label className="sort-icon" label={"INBOX_SORT_ICON"} />
              </div>
            )}
            {sortOrder === "desc" && (
              <div className="rainmaker-displayInline" onClick={() => this.sortingTable("asc")}>
                <ImportExportIcon />
                <Label className="sort-icon" label={"INBOX_SORT_ICON"} />
              </div>
            )}
          </div>
          {data.rows.length === 0 ? (
            <Card textChildren={!remainingDataLoading&&<Label labelClassName="" label="COMMON_INBOX_NO_DATA" />} />
          ) : (
              <div>
                {data.rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                  return (
                    <Card
                      key={index}
                      textChildren={
                        <div>
                          <div className="head" onClick={() => getModuleLink(row[0], row, 0)}>
                            <a style={{ color: "#FE7A51" }}>{row[0].text}</a>
                          </div>
                          <div className="head">
                            <Label label={`CS_COMMON_INBOX_${row[0].subtext.toUpperCase()}`} color="#000000" />
                          </div>

                          <div className="card-div-style">
                            <Label label={data.headers[1]} labelStyle={{ fontWeight: "500" }} />
                          </div>
                          <div className="card-div-style">{row[1].text}</div>

                          <div className="card-div-style">
                            <Label label={data.headers[2]} labelStyle={{ fontWeight: "500" }} />
                          </div>
                          <div className="card-div-style">{row[2].text}</div>

                          <div className="card-div-style">
                            <Label label={data.headers[3]} labelStyle={{ fontWeight: "500" }} />
                          </div>
                          <div className="card-div-style">{row[3].text}</div>

                          <div className="card-div-style">
                            <Label label={data.headers[4]} labelStyle={{ fontWeight: "500" }} />
                          </div>
                          <div className="card-sladiv-style">
                            <span class={"inbox-cell-badge-primary"} style={{ backgroundColor: this.getSlaColor(row[4].text, row[2].text.props.label.includes("AIRPORT_NOC_OFFLINE") ? "AIRPORT_NOC_OFFLINE" : row[2].text.props.label.includes("FIRE_NOC_SRV") ? "FIRE_NOC_SRV" : row[2].text.props.label.split("_")[1]) }}>{row[4].text}</span>
                          </div>
                          {/* <div>
                                <i class="material-icons">error</i>
                          </div> */}
                          <div className="card-viewHistory-icon" onClick={() => onHistoryClick(row[0])}>
                            <i class="material-icons">history</i>
                          </div>
                        </div>
                      }
                    />
                  );
                })}
                <TaskDialog open={this.state.dialogOpen} onClose={onDialogClose} history={ProcessInstances} />
                {!remainingDataLoading&&<TableFooter>
                  <div className={'inbox-table-pagination-sm'}>
                    <TablePagination
                      colSpan={6}
                      rowsPerPageOptions={rowsPerPageOptions}
                      count={data.rows.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      labelRowsPerPage={<Label labelClassName="" label="COMMON_INBOX_ROWS_LABEL" />}
                      onChangePage={this.handleChangePage}
                      onChangeRowsPerPage={this.handleChangeRowsPerPage}
                      ActionsComponent={TablePaginationActionsWrapped}
                    />
                  </div>
                </TableFooter>}
              </div>
            )}
        </Hidden>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { screenConfiguration } = state;
  const { preparedFinalObject } = screenConfiguration;
  const { workflow } = preparedFinalObject;
  const { ProcessInstances } = workflow || [];
  return { ProcessInstances };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setRoute: (url) => dispatch(setRoute(url)),
    toggleSnackbarAndSetText: (open, message) => dispatch(toggleSnackbarAndSetText(open, message)),
    prepareFinalObject: (path, value) => dispatch(prepareFinalObject(path, value)),
  };
};


export const Taskboard = ({ data=[] }) => {
  return (
    <div>
      {data.map((item, i) => (
        <div className="col-sm-4">
          <Card
            className="inbox-card inbox-worklist-card"
            key={i}
            textChildren={
              <div>
                <div className="head">{item.head}</div>
                <div className="body">{item.body}</div>
              </div>
            }
          />
        </div>
      ))}
    </div>
  );
};

InboxData.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(InboxData));