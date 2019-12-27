import React, { Component } from "react";
import { connect } from "react-redux";
import Label from "egov-ui-kit/utils/translationNode";
import { Taskboard } from "../actionItems";
import InboxData from "../Table";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { httpRequest } from "egov-ui-kit/utils/api";
import { withStyles } from "@material-ui/core/styles";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import cloneDeep from "lodash/cloneDeep";
import filter from "lodash/filter";
import orderBy from "lodash/orderBy";
import uniq from "lodash/uniq";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId, localStorageSet, localStorageGet } from "egov-ui-kit/utils/localStorageUtils";
import "./index.css";
import Filter from "../Filter";
import { getLocaleLabels } from "../../../../../ui-utils/commons";
import { TextField } from "components";

const MAX_SLA = 21;
const getWFstatus = (status) => {
  switch (status) {
    case "INITIATED":
      return "Initiated";
    case "APPLIED":
      return "Pending for Document Verification";
    case "FIELDINSPECTION":
      return "Pending for Field Inspection";
    case "PENDINGPAYMENT":
      return "Pending for Payment";
    case "PENDINGAPPROVAL":
      return "Pending for Approval";
    case "APPROVED":
      return "Approved";
  }
};

const styles = (theme) => ({
  textColorPrimary: {
    color: "red",
  },
});

class TableData extends Component {
  state = {
    searchFilter: {
      value: ''
    },
    filter: {
      localityFilter: {
        selectedValue: ["ALL"],
        dropdownData: [
          {
            value: "ALL",
            label: "CS_INBOX_SELECT_ALL",
          }
        ]
      },
      moduleFilter: {
        selectedValue: ["ALL"],
        dropdownData: [
          {
            value: "ALL",
            label: "CS_INBOX_SELECT_ALL",
          }
        ]
      },
      statusFilter: {
        selectedValue: ["ALL"],
        dropdownData: [
          {
            value: "ALL",
            label: "CS_INBOX_SELECT_ALL",
          }
        ]
      }
    },
    value: 0,
    tabData: [],
    taskboardData: [],
    taskboardLabel: '',
    inboxData: [{ headers: [], rows: [] }],
    initialInboxData: [{ headers: [], rows: [] }],
    moduleName: "",
    loaded: false,
    color: "",
  };

  getUniqueList = (list = []) => {
    let newList = [];
    list.map(element => {
      if (!JSON.stringify(newList).includes(JSON.stringify(element))) {
        newList.push(element);
      }
    })
    return newList;
  }
  checkMatch = (uid, value) => {
    if (uid[0].text.toLowerCase().includes(value.toLowerCase()) ||
      uid[3].text.props.label.toLowerCase().includes(value.toLowerCase()) ||
      String(uid[4].text).toLowerCase().includes(value.toLowerCase()) ||
      getLocaleLabels(`CS_COMMON_INBOX_${uid[2].text.props.label.split('_')[1]}`).toLowerCase().includes(value.toLowerCase()) ||
      getLocaleLabels(uid[1].text.props.label).toLowerCase().includes(value.toLowerCase()) ||
      getLocaleLabels(uid[2].text.props.label).toLowerCase().includes(value.toLowerCase())
    ) {
      return true;
    }
    return false;
  }
  handleChangeSearch = (value) => {
    this.setState({
      searchFilter: { value }
    })
    // this.applyFilter(this.state.filter, { value });
  }
  // (taskboardLabel=='')||(taskboardLabel=='WF_TOTAL_NEARING_SLA'&&row[4].text > 0 && row[4].text < MAX_SLA / 3)||
  // (taskboardLabel=='WF_ESCALATED_SLA'&&row[4].text < 0)
  checkSLA = (taskboardLabel, row) => {
    if (taskboardLabel == '' || taskboardLabel == 'WF_TOTAL_TASK') {
      return true;
    } else if ((taskboardLabel == 'WF_TOTAL_NEARING_SLA' && row[4].text > 0 && row[4].text < MAX_SLA / 3)) {
      return true;
    } else if ((taskboardLabel == 'WF_ESCALATED_SLA' && row[4].text < 0)) {
      return true;
    } else {
      return false;
    }
  }
  checkRow = (row, filter, searchFilter, taskboardLabel) => {
    if (this.checkSLA(taskboardLabel, row) && (filter.localityFilter.selectedValue.includes('ALL') || filter.localityFilter.selectedValue.includes(row[1].text.props.label)) &&
      (filter.moduleFilter.selectedValue.includes('ALL') || filter.moduleFilter.selectedValue.includes(row[2].text.props.label.split('_')[1])) &&
      (filter.statusFilter.selectedValue.includes('ALL') || filter.statusFilter.selectedValue.includes(row[2].text.props.label.split('_')[2])) &&
      (searchFilter.value == '' || this.checkMatch(row, searchFilter.value)
      )
    ) {
      return true;
    }
    return false;
  }
  // applyFilter = (filter, searchFilter) => {
  applyFilter = () => {
    // const tempObject = cloneDeep(this.state.initialInboxData);
    let initialInboxData = cloneDeep(this.state.initialInboxData);
    const { filter, searchFilter, taskboardLabel } = this.state;
    if (initialInboxData.length == 2) {
      initialInboxData.map((row, ind) => {
        row.rows = row.rows.filter((uid) => this.checkRow(uid, filter, searchFilter, taskboardLabel))
        // if (!filter.localityFilter.selectedValue.includes('ALL')) {
        //   row.rows = row.rows.filter((uid) => filter.localityFilter.selectedValue.includes(uid[1].text.props.label))
        // }
        // if (!filter.moduleFilter.selectedValue.includes('ALL')) {
        //   row.rows = row.rows.filter((uid) => filter.moduleFilter.selectedValue.includes(uid[2].text.props.label.split('_')[1]))
        // } if (!filter.statusFilter.selectedValue.includes('ALL')) {
        //   row.rows = row.rows.filter((uid) => filter.statusFilter.selectedValue.includes(uid[2].text.props.label.split('_')[2]))
        // }
        // if (searchFilter.value != '') {
        //   row.rows = row.rows.filter((uid) => this.checkMatch(uid, searchFilter.value)
        //   )
        // }
      })
    }
    let ESCALATED_SLA = [];
    let NEARING_SLA = [];
    initialInboxData[1].rows.map(eachRow => {
      if (eachRow[4].text < 0) {
        ESCALATED_SLA.push(eachRow[4].text);
      }
      if (eachRow[4].text > 0 && eachRow[4].text < MAX_SLA / 3) {
        NEARING_SLA.push(eachRow[4].text);
      }
    })


    let { taskboardData, tabData } = this.state;
    taskboardData[0].head = initialInboxData[1].rows.length;
    taskboardData[1].head = NEARING_SLA.length;
    taskboardData[2].head = ESCALATED_SLA.length;
    tabData[0].dynamicArray = [initialInboxData[0].rows.length];
    tabData[1].dynamicArray = [initialInboxData[1].rows.length];
    return {

      inboxData: initialInboxData,
      taskboardData,
      // filteredInboxData: cloneDeep(initialInboxData),
      tabData,
    }
    // this.setState({
    //   filter,
    //   inboxData: initialInboxData,
    //   taskboardData,
    //   filteredInboxData: cloneDeep(initialInboxData),
    //   initialInboxData: tempObject,
    //   tabData, searchFilter

    // })
  }
  handleChangeFilter = (filterName, value) => {
    const filter = { ...this.state.filter }

    if (value.includes('ALL') && this.state.filter[filterName].selectedValue.includes('ALL') && value.length > 1) {
      value.shift()
    } else if (value.includes('ALL') && value.length > 1 && !this.state.filter[filterName].selectedValue.includes('ALL')) {
      value = ['ALL']
    }
    filter[filterName].selectedValue = value
    this.setState({ filter });
    // this.applyFilter(filter, this.state.searchFilter);
  }
  clearFilter = () => {
    const initialInboxData = cloneDeep(this.state.initialInboxData);
    const tempObject = cloneDeep(this.state.initialInboxData);
    const filter = {
      localityFilter: {
        selectedValue: ["ALL"],
        dropdownData: [...this.state.filter.localityFilter.dropdownData]
      },
      moduleFilter: {
        selectedValue: ["ALL"],
        dropdownData: [...this.state.filter.moduleFilter.dropdownData]
      },
      statusFilter: {
        selectedValue: ["ALL"],
        dropdownData: [...this.state.filter.statusFilter.dropdownData]
      }
    }
    let ESCALATED_SLA = [];
    let NEARING_SLA = [];
    initialInboxData[1].rows.map(eachRow => {
      if (eachRow[4].text < 0) {
        ESCALATED_SLA.push(eachRow[4].text);
      }
      if (eachRow[4].text > 0 && eachRow[4].text < MAX_SLA / 3) {
        NEARING_SLA.push(eachRow[4].text);
      }
    })

    let { taskboardData, tabData } = this.state;
    taskboardData[0].head = initialInboxData[1].rows.length;
    taskboardData[1].head = NEARING_SLA.length;
    taskboardData[2].head = ESCALATED_SLA.length;
    tabData[0].dynamicArray = [initialInboxData[0].rows.length];
    tabData[1].dynamicArray = [initialInboxData[1].rows.length];
    this.setState({
      searchFilter: {
        value: ''
      }, filter, taskboardData, tabData, inboxData: initialInboxData,
      filteredInboxData: cloneDeep(initialInboxData),
      initialInboxData: tempObject
    });
  }
  prepareInboxDataRows = async (data) => {
    const { toggleSnackbarAndSetText } = this.props;
    if (isEmpty(data)) return [];
    const businessIds = data.map((item) => {
      return item.businessId;
    });
    const businessServiceData = JSON.parse(localStorageGet("businessServiceData"));
    const modules =
      businessServiceData &&
      businessServiceData.map((item, index) => {
        return item.business;
      });
    const uniqueModules = uniq(modules)

    let localitymap = [];
    try {
      for (var i = 0; i < uniqueModules.length; i++) {
        try {
          const requestBody = {
            searchCriteria: {
              "referenceNumber": businessIds
            }
          }
          const moduleWiseLocality = await httpRequest(`egov-searcher/locality/${uniqueModules[i]}/_get`, "search", [], requestBody);
          localitymap = [...localitymap, ...moduleWiseLocality.Localities];
        } catch (e) {
          console.log("error");
        }
      }
    } catch (e) {
      toggleSnackbarAndSetText(
        true,
        {
          labelName: "Locality Empty!",
          labelKey: "Locality Empty!",
        },
        "error"
      );
    }

    return data.map((item) => {
      const locality = localitymap.find(locality => {
        return locality.referencenumber === item.businessId;
      })
      var sla = item.businesssServiceSla && item.businesssServiceSla / (1000 * 60 * 60 * 24);
      let dataRows = [
        { text: item.businessId, subtext: item.businessService, hiddenText: item.moduleName },
        { text: locality ? <Label label={`${item.tenantId.toUpperCase().replace(/[.]/g, "_")}_REVENUE_${locality.locality}`} color="#000000" /> : <Label label={"NA"} color="#000000" /> },
        {
          text: item.state ? (
            <Label
              label={`WF_${item.businessService.toUpperCase()}_${item.state.state}`}
              defaultLabel={getWFstatus(item.state.state)}
              color="#000000"
            />
          ) : (
              "NA"
            ),
        },
        { text: item.assignee ? <Label label={item.assignee.name} color="#000000" /> : <Label label={"NA"} color="#000000" /> },
        { text: Math.round(sla), badge: true },
        { historyButton: true },
      ];
      return dataRows;
    });
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  setBusinessServiceDataToLocalStorage = async (queryObject) => {
    const { toggleSnackbarAndSetText } = this.props;
    try {
      const payload = await httpRequest("egov-workflow-v2/egov-wf/businessservice/_search", "_search", queryObject);
      localStorageSet("businessServiceData", JSON.stringify(get(payload, "BusinessServices")));
    } catch (e) {
      toggleSnackbarAndSetText(
        true,
        {
          labelName: "Not authorized to access Business Service!",
          labelKey: "ERR_NOT_AUTHORISED_BUSINESS_SERVICE",
        },
        "error"
      );
    }
  };

  componentDidMount = async () => {
    const { toggleSnackbarAndSetText, prepareFinalObject } = this.props;
    const uuid = get(this.props, "userInfo.uuid");
    const tenantId = getTenantId();
    const taskboardData = [];
    const tabData = [];
    const inboxData = [{ headers: [], rows: [] }];
    try {
      const requestBody = [{ key: "tenantId", value: tenantId }];
      const responseData = await httpRequest("egov-workflow-v2/egov-wf/process/_search", "_search", requestBody);
      const assignedData = orderBy(
        filter(responseData.ProcessInstances, (item) => get(item.assignee, "uuid") === uuid),
        ["businesssServiceSla"]
      );
      const allData = orderBy(get(responseData, "ProcessInstances", []), ["businesssServiceSla"]);

      const assignedDataRows = await this.prepareInboxDataRows(assignedData);
      const allDataRows = await this.prepareInboxDataRows(allData);
      let headersList = [
        "WF_INBOX_HEADER_APPLICATION_NO",
        "WF_INBOX_HEADER_LOCALITY",
        "WF_INBOX_HEADER_STATUS",
        // "WF_INBOX_HEADER_ASSIGNED_BY",
        "WF_INBOX_HEADER_CURRENT_OWNER",
        "WF_INBOX_HEADER_SLA_DAYS_REMAINING",
      ];
      inboxData[0].headers = headersList;
      inboxData[0].rows = assignedDataRows;




      tabData.push({ label: "COMMON_INBOX_TAB_ASSIGNED_TO_ME", dynamicArray: [assignedDataRows.length] });
      tabData.push({ label: "COMMON_INBOX_TAB_ALL", dynamicArray: [allDataRows.length] });

      inboxData.push({
        headers: headersList,
        rows: allDataRows,
      });
      let locality = [];
      let moduleDD = [];
      let statusDD = [];
      let NEARING_SLA = [];
      let ESCALATED_SLA = [];
      locality = allDataRows.map((obj) => {
        if (obj[4].text < 0) {
          ESCALATED_SLA.push(obj[4].text);
        }
        if (obj[4].text > 0 && obj[4].text < MAX_SLA / 3) {
          NEARING_SLA.push(obj[4].text);
        }

        let dropdown = { label: getLocaleLabels(obj[1].text.props.label), value: obj[1].text.props.label };
        return dropdown;
      })
      moduleDD = allDataRows.map((obj) => {
        let dropdown = { label: getLocaleLabels(`CS_COMMON_INBOX_${obj[2].text.props.label.split('_')[1]}`), value: obj[2].text.props.label.split('_')[1] };
        return dropdown;

      })
      statusDD = allDataRows.map((obj) => {
        let dropdown = { label: getLocaleLabels(obj[2].text.props.label), value: obj[2].text.props.label.split('_')[2] };
        return dropdown;

      })
      const taskCount = allDataRows.length;
      // const overSla = filter(responseData.ProcessInstances, (item) => item.businesssServiceSla < 0).length;
      taskboardData.push(
        { head: taskCount, body: "WF_TOTAL_TASK", color: "rgb(76, 175, 80 ,0.38)", baseColor: "#4CAF50" },
        { head: NEARING_SLA.length, body: "WF_TOTAL_NEARING_SLA", color: "rgb(238, 167, 58 ,0.38)", baseColor: "#EEA73A" },
        { head: ESCALATED_SLA.length, body: "WF_ESCALATED_SLA", color: "rgb(244, 67, 54 ,0.38)", baseColor: "#F44336" }
      );
      this.setState({
        loaded: true,
        inboxData, taskboardData, tabData, filteredInboxData: cloneDeep(inboxData), initialInboxData: cloneDeep(inboxData), filter: {
          localityFilter: {
            selectedValue: ['ALL'],
            dropdownData: this.getUniqueList([
              {
                value: "ALL",
                label: getLocaleLabels("CS_INBOX_SELECT_ALL"),
              }, ...locality
            ])
          },
          moduleFilter: {
            selectedValue: ['ALL'],
            dropdownData: this.getUniqueList([
              {
                value: "ALL",
                label: getLocaleLabels("CS_INBOX_SELECT_ALL"),
              }, ...moduleDD
            ])
          },
          statusFilter: {
            selectedValue: ['ALL'],
            dropdownData: this.getUniqueList([
              {
                value: "ALL",
                label: getLocaleLabels("CS_INBOX_SELECT_ALL"),
              }, ...statusDD
            ])
          }
        }
      });
    } catch (e) {
      toggleSnackbarAndSetText(true, { labelName: "Workflow search error !", labelKey: "ERR_SEARCH_ERROR" }, "error");
    }
    prepareFinalObject("InboxData", [...inboxData]);
    this.setBusinessServiceDataToLocalStorage([{ key: "tenantId", value: getTenantId() }]);
  };

  onModuleFilter = (event) => {
    this.setState({ moduleName: event.target.value }, () => {
      const { InboxData } = this.props;
      let { tabData } = this.state;
      const filteredData = InboxData.map((item, index) => {
        return {
          headers: item.headers,
          rows: item.rows.filter((eachRow) => {
            return eachRow[0].subtext === this.state.moduleName;
          }),
        };
      });

      tabData[0] = { label: "COMMON_INBOX_TAB_ASSIGNED_TO_ME", dynamicArray: [filteredData[0].rows.length] };
      tabData[1] = { label: "COMMON_INBOX_TAB_ALL", dynamicArray: [filteredData[1].rows.length] };

      this.setState({
        inboxData: filteredData,
        tabData,
      });
    });
  };

  onTaskBoardClick = (baseColor, label) => {
    let inboxData = cloneDeep(this.state.filteredInboxData);
    let { tabData } = this.state;
    let filteredData = [];
    if (label === "WF_TOTAL_NEARING_SLA") {
      filteredData = inboxData.map((item, index) => {
        return {
          headers: item.headers,
          rows: item.rows.filter((eachRow) =>
            eachRow[4].text > 0 && eachRow[4].text < MAX_SLA / 3
            // 4 < eachRow[4].text && 8 >= eachRow[4].text;
          ),
        };
      });
    } else if (label === "WF_ESCALATED_SLA") {
      filteredData = inboxData.map((item, index) => {
        return {
          headers: item.headers,
          rows: item.rows.filter((eachRow) =>
            eachRow[4].text < 0
            // 8 < eachRow[4].text && 12 >= eachRow[4].text;
          ),
        };
      });
    } else {
      filteredData = inboxData;
    }
    tabData[0] = { label: "COMMON_INBOX_TAB_ASSIGNED_TO_ME", dynamicArray: [filteredData[0].rows.length] };
    tabData[1] = { label: "COMMON_INBOX_TAB_ALL", dynamicArray: [filteredData[1].rows.length] };

    this.setState({
      // inboxData: filteredData,
      // tabData,
      taskboardLabel: label
    });

    this.setState({
      color: baseColor,
    });
  };

  render() {
    const { value, moduleName, filter, searchFilter } = this.state;
    const { classes, onPopupOpen } = this.props;
    const { handleChangeFilter, clearFilter, handleChangeSearch } = this;
    let { taskboardData, tabData, inboxData } = this.state;
    if (this.state.loaded) {
      const filteredData = this.applyFilter();
      taskboardData = filteredData.taskboardData;
      inboxData = filteredData.inboxData;
      tabData = filteredData.tabData;
    }
    // const {taskboardData, tabData, inboxData}=this.applyFilter();
    console.log(this.state, 'satte');

    return (
      <div className="col-sm-12">
        <div>
          <div className="col-md-8">
            <Label className="landingPageUser" label={"WF_MY_WORKLIST"} />
          </div>
          <div className="col-md-4"> <TextField floatingLabelText={getLocaleLabels("CS_INBOX_SEARCH")}
            hintText={getLocaleLabels("CS_INBOX_SEARCH_PLACEHOLDER")}
            value={searchFilter.value}
            onChange={(e, value) => {

              handleChangeSearch(value);
            }}

            className="filter-fields" /></div>

          <Filter handleChangeFilter={handleChangeFilter.bind(this)} clearFilter={clearFilter} filter={filter}></Filter>
          {/* <TextField value={"search"} />
          */}
          {/* <Icon action="custom" name="filter" onClick={onPopupOpen} style={{ cursor: "pointer" }} />  */}
        </div>
        <Taskboard data={taskboardData} onSlaClick={this.onTaskBoardClick} color={this.state.color} />
        <div className="col-sm-12 backgroundWhite">
          <Tabs
            value={value}
            onChange={this.handleChange}
            className={`inbox-tabs-container ${classes.textColorPrimary}`}
            indicatorColor="primary"
            textColor="primary"
            style={{ borderBottom: "1px rgba(0, 0, 0, 0.11999999731779099) solid", textColor: "red" }}
          >
            {tabData.map((item) => {
              return (
                <Tab className={`inbox-tab ${classes.textColorPrimary}`} label={<Label label={item.label} dynamicArray={item.dynamicArray} />} />
              );
            })}
          </Tabs>
          <InboxData MAX_SLA={MAX_SLA} data={inboxData[value]} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { screenConfiguration, auth } = state;
  const { userInfo } = auth;
  const { preparedFinalObject } = screenConfiguration;
  const { InboxData } = preparedFinalObject;

  return { InboxData, userInfo };
};

const mapDispatchToProps = (dispatch) => {
  return {
    prepareFinalObject: (jsonPath, value) => dispatch(prepareFinalObject(jsonPath, value)),
    toggleSnackbarAndSetText: (open, message, error) => dispatch(toggleSnackbarAndSetText(open, message, error)),
  };
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(TableData));
