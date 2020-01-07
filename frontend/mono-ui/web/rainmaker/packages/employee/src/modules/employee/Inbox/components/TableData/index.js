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
import { getLocaleLabels, transformById } from "egov-ui-framework/ui-utils/commons";
import { getTenantId, localStorageSet, localStorageGet ,getLocalization,getLocale} from "egov-ui-kit/utils/localStorageUtils";
import "./index.css";
import Filter from "../Filter";
import TextFieldIcon  from  "egov-ui-kit/components/TextFieldIcon";
import FilterListIcon from '@material-ui/icons/FilterList';
import Hidden from "@material-ui/core/Hidden"; 

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

let localizationLabels = transformById(
  JSON.parse(getLocalization(`localization_${getLocale()}`)),
  "code"
);

class TableData extends Component {
  state = {
    businessServiceSla: {},
    searchFilter: {
      value: '',
      typing: false
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
    showFilter:false,
    value: 0,
    tabData: [{ label: "COMMON_INBOX_TAB_ASSIGNED_TO_ME", dynamicArray: [0] }
      , { label: "COMMON_INBOX_TAB_ALL", dynamicArray: [0] }],
    taskboardData: [{ head: 0, body: "WF_TOTAL_TASK", color: "rgb(171,211,237)", baseColor: "rgb(53,152,219)" },
    { head: 0, body: "WF_TOTAL_NEARING_SLA", color: "rgb(238, 167, 58 ,0.38)", baseColor: "#EEA73A" },
    { head: 0, body: "WF_ESCALATED_SLA", color: "rgb(244, 67, 54 ,0.38)", baseColor: "#F44336" }],
    taskboardLabel: '',
    inboxData: [{ headers: [], rows: [] }],
    initialInboxData: [{ headers: [], rows: [] }],
    moduleName: "",
    loaded: false,
    color: "",
    timeoutForTyping: false
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
  checkMatch = (row, value) => {
    if (value.length <= 2) {
      return true;
    }
    if (row[5].hiddenField.length !== 6) {
      if (row[0].text.toLowerCase().includes(value.toLowerCase()) ||
        row[3].text.props.label.toLowerCase().includes(value.toLowerCase()) ||
        String(row[4].text).toLowerCase().includes(value.toLowerCase()) ||
        getLocaleLabels("",`CS_COMMON_INBOX_${row[2].text.props.label.split('_')[1]}`).toLowerCase().includes(value.toLowerCase(),localizationLabels) ||
        getLocaleLabels("",row[1].text.props.label).toLowerCase().includes(value.toLowerCase(),localizationLabels) ||
        getLocaleLabels("",row[2].text.props.label).toLowerCase().includes(value.toLowerCase(),localizationLabels)
      ) {
        return true;
      }


    }
    if (
      row[5].hiddenField[0].includes(value.toLowerCase()) ||
      row[5].hiddenField[1].includes(value.toLowerCase()) ||
      row[5].hiddenField[2].includes(value.toLowerCase()) ||
      row[5].hiddenField[3].includes(value.toLowerCase()) ||
      row[5].hiddenField[4].includes(value.toLowerCase()) ||
      row[5].hiddenField[5].includes(value.toLowerCase())

    ) {
      return true;
    }
    return false;
  }
  handleChangeSearch = (value) => {
    this.setState({
      searchFilter: { value, typing: true }
    })
  }

  checkSLA = (taskboardLabel, row) => {
    const MAX_SLA = this.state.businessServiceSla[row[2].text.props.label.split('_')[1]];
    if (taskboardLabel == '' || taskboardLabel == 'WF_TOTAL_TASK') {
      return true;
    } else if ((taskboardLabel == 'WF_TOTAL_NEARING_SLA' && row[4].text > 0 && row[4].text <= (MAX_SLA - MAX_SLA / 3))) {
      return true;
    } else if ((taskboardLabel == 'WF_ESCALATED_SLA' && row[4].text <= 0)) {
      return true;
    } else {
      return false;
    }
  }
  checkRow = (row, filter, searchFilter, taskboardLabel) => {
    if ((filter.localityFilter.selectedValue.includes('ALL') || filter.localityFilter.selectedValue.includes(row[1].text.props.label)) &&
      (filter.moduleFilter.selectedValue.includes('ALL') || filter.moduleFilter.selectedValue.includes(row[2].text.props.label.split('_')[1])) &&
      (filter.statusFilter.selectedValue.includes('ALL') || filter.statusFilter.selectedValue.includes(row[2].text.props.label.split('_')[2])) &&
      (searchFilter.value == '' || this.checkMatch(row, searchFilter.value)
      )
    ) {
      return true;
    }
    return false;
  }
  convertMillisecondsToDays = (milliseconds) => {
    return (milliseconds / (1000 * 60 * 60 * 24));
  }
  applyFilter = (inboxData) => {
    this.showLoading();
    let initialInboxData = inboxData ? cloneDeep(inboxData) : cloneDeep(this.state.initialInboxData);
    const { filter, searchFilter, taskboardLabel } = this.state;
    let ESCALATED_SLA = [];
    let NEARING_SLA = [];
    let totalRows = []
    if (initialInboxData.length == 2) {
      initialInboxData.map((row, ind) => {
        row.rows = row.rows.filter((eachRow) => {
          let isValid = this.checkRow(eachRow, filter, searchFilter, taskboardLabel);
          if (isValid && ind == 1) {
            let MAX_SLA = this.state.businessServiceSla[eachRow[2].text.props.label.split('_')[1]];
            if (eachRow[4].text <= 0) {
              ESCALATED_SLA.push(eachRow[4].text);
            }
            if (eachRow[4].text > 0 && eachRow[4].text <= (MAX_SLA - MAX_SLA / 3)) {
              NEARING_SLA.push(eachRow[4].text);
            }
            totalRows.push(1);
          }
          if (isValid) {
            return this.checkSLA(taskboardLabel, eachRow);
          }
          return isValid;
        }

        )
      })
    }
    
    if (initialInboxData.length == 2) {
      initialInboxData.map((row, ind) => {
        row.rows = row.rows.filter((eachRow) => {
          let isValid = this.checkSLA(taskboardLabel,eachRow);
          return isValid;
        }
        )
      })
    }



    let { taskboardData, tabData } = this.state;
    taskboardData[0].head = totalRows.length;
    taskboardData[1].head = NEARING_SLA.length;
    taskboardData[2].head = ESCALATED_SLA.length;
    tabData[0].dynamicArray = [initialInboxData[0].rows.length];
    tabData[1].dynamicArray = [initialInboxData[1].rows.length];
    this.hideLoading();
    return {
      inboxData: initialInboxData,
      taskboardData,
      tabData,
    }

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

    this.setState({
      searchFilter: {
        value: '', typing: false
      }, filter, inboxData: initialInboxData,
      initialInboxData: tempObject
    });
  }
  prepareInboxDataRows = async (data,all) => {
    const { toggleSnackbarAndSetText } = this.props;
    if (isEmpty(data)) return [];
    const businessIds = data.map((item) => {
      return item.businessId;
    });
    const businessServiceData = this.getBussinessServiceData();
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
    let localityDropdownList=[];
    let moduleDropdownList=[];
    let statusDropdownList=[];

    
    const initialData = data.map((item) => {
      const locality = localitymap.find(locality => {
        return locality.referencenumber === item.businessId;
      })
      var sla = item.businesssServiceSla && item.businesssServiceSla / (1000 * 60 * 60 * 24);
      let row0 = {text: item.businessId, subtext: item.businessService, hiddenText: item.moduleName };
      let row1 = {text: locality ? <Label label={`${item.tenantId.toUpperCase().replace(/[.]/g, "_")}_REVENUE_${locality.locality}`} color="#000000" /> : <Label label={"NA"} color="#000000" /> };
      let row2 = {
        text: item.state ? (
          <Label
            label={`WF_${item.businessService.toUpperCase()}_${item.state.state}`}
            defaultLabel={getWFstatus(item.state.state)}
            color="#000000"
          />
        ) : (
            "NA"
          ),
      };

      let row3 = { text: item.assigner ? <Label label={item.assigner.name} color="#000000" /> : <Label label={"NA"} color="#000000" /> };
      let row4 = { text: Math.round(sla), badge: true };
      let row5 = { historyButton: true };

      let localityDropdown = { label: getLocaleLabels("",row1.text.props.label,localizationLabels), value: row1.text.props.label };
      localityDropdownList.push(localityDropdown);
      let moduleDropdown = { label: getLocaleLabels("",`CS_COMMON_INBOX_${row2.text.props.label.split('_')[1]}`,localizationLabels), value: row2.text.props.label.split('_')[1] };
      moduleDropdownList.push(moduleDropdown);
      let statusDropdown = { label:  getLocaleLabels("",row2.text.props.label,localizationLabels), value: row2.text.props.label.split('_')[2] };
      statusDropdownList.push(statusDropdown);

      let dataRows = [
        row0,
        row1,
        row2,
        row3,
        row4,
        {
        ...row5, hiddenField: [row0.text.toLowerCase(),
        String(row4.text),
        getLocaleLabels("",`CS_COMMON_INBOX_${row2.text.props.label.split('_')[1]}`,localizationLabels).toLowerCase(),
        getLocaleLabels("",row1.text.props.label , localizationLabels).toLowerCase(),
        getLocaleLabels("",row2.text.props.label ,localizationLabels).toLowerCase(),
        row3.text.props.label.toLowerCase()]
        }
      ];
      return dataRows;
    });

    if(all){
      this.setState({
        filter: {
          localityFilter: {
            selectedValue: ['ALL'],
            dropdownData: this.getUniqueList([
              {
                value: "ALL",
                label: getLocaleLabels("","CS_INBOX_SELECT_ALL",localizationLabels),
              }, ...localityDropdownList
            ])
          },
          moduleFilter: {
            selectedValue: ['ALL'],
            dropdownData: this.getUniqueList([
              {
                value: "ALL",
                label: getLocaleLabels("","CS_INBOX_SELECT_ALL",localizationLabels),
              }, ...moduleDropdownList
            ])
          },
          statusFilter: {
            selectedValue: ['ALL'],
            dropdownData: this.getUniqueList([
              {
                value: "ALL",
                label: getLocaleLabels("","CS_INBOX_SELECT_ALL",localizationLabels),
              }, ...statusDropdownList
            ])
          }
        }
      });
  
    }
    return initialData;
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  getBussinessServiceData() {
    let businessServiceData = JSON.parse(localStorageGet("businessServiceData"));
    businessServiceData = businessServiceData ? businessServiceData : this.setBusinessServiceDataToLocalStorage([{ key: "tenantId", value: getTenantId() }]);;
    return businessServiceData;
  }
  getMaxSLA() {
    const businessServiceData = this.getBussinessServiceData();
    let businessServiceSla = {}
    businessServiceData.map(eachRow => {
      businessServiceSla[eachRow.businessService.toUpperCase()] = this.convertMillisecondsToDays(eachRow.businessServiceSla);
    })
    this.setState({ businessServiceSla });
    return businessServiceSla;
  }
  setBusinessServiceDataToLocalStorage = async (queryObject) => {
    const { toggleSnackbarAndSetText } = this.props;
    try {
      const payload = await httpRequest("egov-workflow-v2/egov-wf/businessservice/_search", "_search", queryObject);
      localStorageSet("businessServiceData", JSON.stringify(get(payload, "BusinessServices")));
      return get(payload, "BusinessServices");
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
    let { taskboardData, tabData } = this.state;

    const inboxData = [{ headers: [], rows: [] }];
    try {
      this.showLoading();
      this.setBusinessServiceDataToLocalStorage([{ key: "tenantId", value: getTenantId() }]);
      const requestBody = [{ key: "tenantId", value: tenantId }];
      const responseData = await httpRequest("egov-workflow-v2/egov-wf/process/_search", "_search", requestBody);
      const assignedData = orderBy(
        filter(responseData.ProcessInstances, (item) => get(item.assigner, "uuid") === uuid),
        ["businesssServiceSla"]
      );
      const allData = orderBy(get(responseData, "ProcessInstances", []), ["businesssServiceSla"]);


      // const assignedDataRows = []
      // const allDataRows = []

      const assignedDataRows = await this.prepareInboxDataRows(assignedData);
      const allDataRows = await this.prepareInboxDataRows(allData,true);
      
      
      let headersList = [
        "WF_INBOX_HEADER_APPLICATION_NO",
        "WF_INBOX_HEADER_LOCALITY",
        "WF_INBOX_HEADER_STATUS",
        "WF_INBOX_HEADER_CURRENT_OWNER",
        "WF_INBOX_HEADER_SLA_DAYS_REMAINING",
      ];
      inboxData[0].headers = headersList;
      inboxData[0].rows = assignedDataRows;

      tabData[0].dynamicArray = [assignedDataRows.length];
      tabData[1].dynamicArray = [allDataRows.length];
      inboxData.push({
        headers: headersList,
        rows: allDataRows,
      });
      let NEARING_SLA = [];
      let ESCALATED_SLA = [];
      const taskCount = allDataRows.length;
      taskboardData[0].head = taskCount;
      taskboardData[1].head = NEARING_SLA.length;
      taskboardData[2].head = ESCALATED_SLA.length;

      this.setState({
        loaded: true,
        inboxData, taskboardData, tabData, initialInboxData: cloneDeep(inboxData)
      });
      this.hideLoading()
    } catch (e) {
      toggleSnackbarAndSetText(true, { labelName: "Workflow search error !", labelKey: "ERR_SEARCH_ERROR" }, "error");
    }
    prepareFinalObject("InboxData", [...inboxData]);
    this.getMaxSLA();
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
    this.setState({
      taskboardLabel: label
    });
    this.setState({
      color: baseColor,
    });
  };
  showLoading() {
    const { prepareFinalObject } = this.props;
    prepareFinalObject('Loading.isLoading', true);
  }
  hideLoading() {
    const { prepareFinalObject } = this.props;
    prepareFinalObject('Loading.isLoading', false);
  }
  render() {
    const { value, moduleName, filter, searchFilter, businessServiceSla } = this.state;
    const { classes, onPopupOpen } = this.props;
    const { handleChangeFilter, clearFilter, handleChangeSearch, resetTyping } = this;
    let { taskboardData, tabData, inboxData } = this.state;

    if (this.state.loaded) {
      const filteredData = this.applyFilter();
      taskboardData = filteredData.taskboardData;
      inboxData = filteredData.inboxData;
      tabData = filteredData.tabData;
    }
    return (
      <div className="col-md-12 col-sm-12 col-xs-12">
        <div>
          <div className="row" style={{ marginBottom: '5px', marginLeft: '-20px' }}>
            <div className="col-md-8 col-sm-8 col-xs-12"  style={{ marginTop: '5px'}}>
              <Label className="landingPageUser" label={"WF_MY_WORKLIST"} />
            </div>
            <div className="col-md-4 col-sm-4 col-xs-10 search-bar">
              <TextFieldIcon
                hintText={getLocaleLabels("","CS_INBOX_SEARCH",localizationLabels)}
                value={searchFilter.value}
                iconPosition="before"
                className="whiteBackground"
                onChange={(e, value) => {
                  handleChangeSearch(value);
                }}
              />
            </div>
            <div className="icon-hidden filter-icon col-xs-2" onClick={()=>{
              this.setState({showFilter:!this.state.showFilter})
            }}>
            <FilterListIcon />
            </div>
          </div>
          <Hidden only={["xs"]} implementation="css">
          <Filter handleChangeFilter={handleChangeFilter.bind(this)} clearFilter={clearFilter} filter={filter}></Filter></Hidden>
          <Hidden only={["sm", "md", "lg", "xl"]} implementation="css">
          {this.state.showFilter&&
          <Filter handleChangeFilter={handleChangeFilter.bind(this)} clearFilter={clearFilter} filter={filter}></Filter>}
          </Hidden>
        </div>
        <Taskboard data={taskboardData} onSlaClick={this.onTaskBoardClick} color={this.state.color} />
        <div className="backgroundWhite">
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
          <InboxData businessServiceSla={businessServiceSla} data={inboxData[value]} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { screenConfiguration, auth } = state;
  const { userInfo } = auth;
  const { preparedFinalObject } = screenConfiguration;
  const { InboxData, isLoading } = preparedFinalObject;

  return { InboxData, userInfo };
};

const mapDispatchToProps = (dispatch) => {
  return {
    prepareFinalObject: (jsonPath, value) => dispatch(prepareFinalObject(jsonPath, value)),
    toggleSnackbarAndSetText: (open, message, error) => dispatch(toggleSnackbarAndSetText(open, message, error)),
  };
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(TableData));
