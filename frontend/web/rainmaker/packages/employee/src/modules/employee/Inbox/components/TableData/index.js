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
import filter from "lodash/filter";
import orderBy from "lodash/orderBy";
import uniq from "lodash/uniq";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTenantId, localStorageSet, localStorageGet } from "egov-ui-kit/utils/localStorageUtils";
import "./index.css";
import Filter from "../Filter";

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
    filter: {
      localityFilter: {
        selectedValue: 'ALL',
        dropdownData: [
          {
              value: "ALL",
              label: "All",
          }
      ]
      },
      moduleFilter: {
        selectedValue: 'ALL',
        dropdownData: [
          {
              value: "ALL",
              label: "All",
          }
      ]
      },
      statusFilter: {
        selectedValue: 'ALL',
        dropdownData: [
          {
              value: "ALL",
              label: "All",
          }
      ]
      }
    },
    value: 0,
    tabData: [],
    taskboardData: [],
    inboxData: [{ headers: [], rows: [] }],
    moduleName: "",
    color: "",
  };
  handleChangeFilter=(filterName,value)=>{   
    const filter={...this.state.filter}
    filter[filterName].selectedValue=value
        this.setState({
          filter
        })
      }
      clearFilter=()=>{
        const filter= {
          localityFilter: {
            selectedValue: 'ALL',
            dropdownData: [...this.state.filter.localityFilter.dropdownData]
          },
          moduleFilter: {
            selectedValue: 'ALL',
            dropdownData: [...this.state.filter.moduleFilter.dropdownData]
          },
          statusFilter: {
            selectedValue: 'ALL',
            dropdownData: [...this.state.filter.statusFilter.dropdownData]
          }
        }
        this.setState({filter});
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
    
    let localitymap =[];
     try {
      for (var i = 0; i < uniqueModules.length; i++) {
        try {
          const requestBody  = {
            searchCriteria : {
              "referenceNumber" :  businessIds
            }
          }
          const moduleWiseLocality = await httpRequest(`egov-searcher/locality/${uniqueModules[i]}/_get`, "search", [] , requestBody);
          localitymap = [...moduleWiseLocality.Localities];
        }catch(e){
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
        { text: item.businessId, subtext: `CS_COMMON_INBOX_${item.businessService.toUpperCase()}` },
        { text:  locality ? <Label label={`${item.tenantId.toUpperCase().replace(/[.]/g, "_")}_REVENUE_${locality.locality}`} color="#000000"/> : <Label label={"NA"} color="#000000" />},
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
// setData=(allData,assignedData)=>{
  
//   const { toggleSnackbarAndSetText, prepareFinalObject } = this.props;
//   const uuid = get(this.props, "userInfo.uuid");
//   const tenantId = getTenantId();

//   const taskboardData = [];
//   const tabData = [];
//   const inboxData = [{ headers: [], rows: [] }];

//   try {
//     const requestBody = [{ key: "tenantId", value: tenantId }];
//     const responseData = await httpRequest("egov-workflow-v2/egov-wf/process/_search", "_search", requestBody);
//     const assignedData = orderBy(
//       filter(responseData.ProcessInstances, (item) => get(item.assignee, "uuid") === uuid),
//       ["businesssServiceSla"]
//     );
//     const allData = orderBy(get(responseData, "ProcessInstances", []), ["businesssServiceSla"]);

//     const assignedDataRows = await this.prepareInboxDataRows(assignedData);
//     const allDataRows = await this.prepareInboxDataRows(allData);

//     let headersList = [
//       "WF_INBOX_HEADER_APPLICATION_NO",
//       "WF_INBOX_HEADER_LOCALITY",
//       "WF_INBOX_HEADER_STATUS",
//       // "WF_INBOX_HEADER_ASSIGNED_BY",
//       "WF_INBOX_HEADER_ASSIGNED_TO",
//       "WF_INBOX_HEADER_SLA_DAYS_REMAINING",
//     ];
//     inboxData[0].headers = headersList;
//     inboxData[0].rows = assignedDataRows;

//     const taskCount = allDataRows.length;
//     const overSla = filter(responseData.ProcessInstances, (item) => item.businesssServiceSla < 0).length;

//     taskboardData.push(
//       { head: taskCount, body: "WF_TOTAL_TASK", color: "rgb(76, 175, 80 ,0.38)", baseColor: "#4CAF50" },
//       { head: "0", body: "WF_TOTAL_NEARING_SLA", color: "rgb(238, 167, 58 ,0.38)", baseColor: "#EEA73A" },
//       { head: overSla, body: "WF_ESCALATED_SLA", color: "rgb(244, 67, 54 ,0.38)", baseColor: "#F44336" }
//     );

//     tabData.push({ label: "COMMON_INBOX_TAB_ASSIGNED_TO_ME", dynamicArray: [assignedDataRows.length] });
//     tabData.push({ label: "COMMON_INBOX_TAB_ALL", dynamicArray: [allDataRows.length] });

//     inboxData.push({
//       headers: headersList,
//       rows: allDataRows,
//     });
//     this.setState({ inboxData, taskboardData, tabData });
//   } catch (e) {
//     toggleSnackbarAndSetText(true, { labelName: "Workflow search error !", labelKey: "ERR_SEARCH_ERROR" }, "error");
//   }
//   prepareFinalObject("InboxData", inboxData);

//   this.setBusinessServiceDataToLocalStorage([{ key: "tenantId", value: getTenantId() }]);

// }
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
        "WF_INBOX_HEADER_ASSIGNED_TO",
        "WF_INBOX_HEADER_SLA_DAYS_REMAINING",
      ];
      inboxData[0].headers = headersList;
      inboxData[0].rows = assignedDataRows;

      const taskCount = allDataRows.length;
      const overSla = filter(responseData.ProcessInstances, (item) => item.businesssServiceSla < 0).length;

      taskboardData.push(
        { head: taskCount, body: "WF_TOTAL_TASK", color: "rgb(76, 175, 80 ,0.38)", baseColor: "#4CAF50" },
        { head: "0", body: "WF_TOTAL_NEARING_SLA", color: "rgb(238, 167, 58 ,0.38)", baseColor: "#EEA73A" },
        { head: overSla, body: "WF_ESCALATED_SLA", color: "rgb(244, 67, 54 ,0.38)", baseColor: "#F44336" }
      );

      tabData.push({ label: "COMMON_INBOX_TAB_ASSIGNED_TO_ME", dynamicArray: [assignedDataRows.length] });
      tabData.push({ label: "COMMON_INBOX_TAB_ALL", dynamicArray: [allDataRows.length] });

      inboxData.push({
        headers: headersList,
        rows: allDataRows,
      });
      this.setState({ inboxData, taskboardData, tabData });
    } catch (e) {
      toggleSnackbarAndSetText(true, { labelName: "Workflow search error !", labelKey: "ERR_SEARCH_ERROR" }, "error");
    }
    prepareFinalObject("InboxData", inboxData);

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
    const { InboxData } = this.props;
    let { tabData } = this.state;
    let filteredData = [];
    if (label === "WF_TOTAL_NEARING_SLA") {
      filteredData = InboxData.map((item, index) => {
        return {
          headers: item.headers,
          rows: item.rows.filter((eachRow) => {
            4 < eachRow[4].text && 8 >= eachRow[4].text;
          }),
        };
      });
    } else if (label === "WF_ESCALATED_SLA") {
      filteredData = InboxData.map((item, index) => {
        return {
          headers: item.headers,
          rows: item.rows.filter((eachRow) => {
            8 < eachRow[4].text && 12 >= eachRow[4].text;
          }),
        };
      });
    } else {
      filteredData = InboxData;
    }
    tabData[0] = { label: "COMMON_INBOX_TAB_ASSIGNED_TO_ME", dynamicArray: [filteredData[0].rows.length]};
    tabData[1] = { label: "COMMON_INBOX_TAB_ALL", dynamicArray: [filteredData[1].rows.length]  };

    this.setState({
      inboxData: filteredData,
      tabData,
    });

    this.setState({
      color: baseColor,
    });
  };

  render() {
    const { value, taskboardData, tabData, inboxData, moduleName,filter } = this.state;
    const { classes, onPopupOpen } = this.props;
    const {handleChangeFilter,clearFilter} =this;
    return (
      <div className="col-sm-12">
        <div>
          <Label className="landingPageUser" label={"WF_MY_WORKLIST"} />
          {/* <Filter handleChangeFilter={handleChangeFilter} clearFilter={clearFilter} filter={filter}></Filter> */}
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
        <InboxData data={inboxData[value]} />
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
