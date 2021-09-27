import React, { Component } from "react";
import { Card, Icon, List, Image, AutoSuggest, Button } from "components";
// import faceOne from "egov-ui-kit/assets/images/faceOne.jpg";
import faceOne from "egov-ui-kit/assets/images/download.png";
import Label from "egov-ui-kit/utils/translationNode";
import { getNameFromId } from "egov-ui-kit/utils/commons";
import "./index.css";
import isEqual from "lodash/isEqual";

export default class ListCard extends Component {
  state = {
    results: [],
    searchTerm: "",
    selectedEmployeeId: "",
    dataSource: [],
  };

  avatarStyle = {
    top: 8,
    left: 17,
    height: 33,
    width: 33,
  };

  mainLabelStyle = {
    letterSpacing: 0.6,
    marginBottom: 4,
  };
  callIconStyle = {
    width: 16,
    height: 16,
    top: 0,
    right: 30,
    margin: "0px",
  };

  getItemForDepartment = (item, department) => {
    return {
      ...item,
      assignments: item.assignments.filter((assignmentItem) => assignmentItem.department === department),
    };
  };

  prepareRawDataToFormat = (rawData) => {
    let { designationsById, departmentById } = this.props;
    const seperateByDepartment =
      rawData &&
      rawData.reduce((result, item) => {
        for (let i = 0; i < item.assignments.length; i++) {
          if (!result[item.assignments[i].department]) result[item.assignments[i].department] = [];
          result[item.assignments[i].department].push(this.getItemForDepartment(item, item.assignments[i].department));
        }
        return result;
      }, {});
    return (
      seperateByDepartment &&
      Object.keys(seperateByDepartment).map((depDetails, index) => {
        return {
          id: depDetails,
          primaryText: (
            <Label
              label={getNameFromId(departmentById, depDetails,`COMMON_MASTERS_DEPARTMENT_${depDetails}` )}
              dark={true}
              bold={true}
              containerStyle={{ position: "absolute", top: 0, left: 0 }}
              labelStyle={this.mainLabelStyle}
            />
          ),
          open: true,
          toplevel: "true",
          nestedItems: seperateByDepartment[depDetails].map((depItem, depItemIndex) => {
            return {
              id: depItem.id,
              primaryText: <Label label={depItem && depItem.name} dark={true} bold={true} labelStyle={this.mainLabelStyle} />,
              leftAvatar: <Image circular={true} source={depItem.photo ? depItem.photo : faceOne} style={this.avatarStyle} />,
              secondaryText: (
                <Label
                  label={depItem && depItem.assignments && getNameFromId(designationsById, depItem.assignments[0].designation,`COMMON_MASTERS_DESIGNATION_${depItem.assignments[0].designation}` )}
                  style={{ letterSpacing: 0 }}
                />
              ),
              rightIcon: depItem && depItem.mobileNumber && (
                <a
                  className="pgr-call-icon emp-directory-call-icon-link"
                  href={`tel:+91${depItem.mobileNumber}`}
                  style={{
                    textDecoration: "none",
                    height: "inherit",
                    width: "inherit",
                    top: 0,
                    margin: 0,
                    right: 16,
                    bottom: 0,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Icon className="emp-directory-call-icon" action="communication" name="call" style={this.callIconStyle} color="#22b25f" />
                  <span style={{ color: "#484848" }}>{`+91${depItem.mobileNumber}`}</span>
                </a>
              ),
            };
          }),
        };
      })
    );
  };

  componentDidMount = () => {
    let { APIData } = this.props;
    let { prepareRawDataToFormat } = this;
    // initForm(this.formConfig);
    const dataSource = prepareRawDataToFormat(APIData);
    this.setState({ dataSource });
  };

  componentWillReceiveProps = (nextProps) => {
    if (!isEqual(this.props.APIData, nextProps.APIData)) {
      const dataSource = this.prepareRawDataToFormat(nextProps.APIData);
      this.setState({ dataSource });
    }
  };

  prepareResultsForDisplay = (results = []) => {
    return results.map((result) => {
      const listItem = {};
      listItem.id = result.id;
      listItem.primaryText = result.primaryText;
      listItem.open = result.open;
      listItem.toplevel = result.toplevel;
      listItem.secondaryText = result.secondaryText;
      listItem.leftAvatar = result.leftAvatar;
      listItem.rightIcon = result.rightIcon;
      listItem.style = result.style && result.style;
      if (result.nestedItems) {
        listItem.nestedItems = result.nestedItems.map((nestedItem, index) => {
          const item = {};
          item.id = nestedItem.id;
          item.primaryText = nestedItem.primaryText;
          item.secondaryText = nestedItem.secondaryText;
          item.leftAvatar = nestedItem.leftAvatar;
          item.rightIcon = nestedItem.rightIcon;
          item.style = nestedItem.style && nestedItem.style;
          item.onClick = this.onEmployeeChosen.bind(null, item);
          return item;
        });
      }
      return listItem;
    });
  };

  flatten = (arr) => {
    return arr.reduce((flat, toFlatten) => {
      return flat.concat(Array.isArray(toFlatten) ? this.flatten(toFlatten) : toFlatten);
    }, []);
  };

  changeClickedItem = (dataSource, id) => {
    // let _dataSource = dataSource.map((item) => ({ ...item }));
    for (var i = 0; i < dataSource.length; i++) {
      if (dataSource[i].nestedItems) {
        this.changeClickedItem(dataSource[i].nestedItems, id);
      }
      if (dataSource[i].id === id) {
        dataSource[i] = {
          ...dataSource[i],
          style: { background: "#f8f8f8", borderLeft: "3px solid #fe7a51" },
          leftAvatar: (
            <div className="avatar-selected" style={{ width: 33, height: 33, background: "#fe7a51", borderRadius: "50%", top: 8, left: 17 }}>
              <Icon action="navigation" name="check" color={"#ffffff"} style={{ width: 16, height: 16 }} />
            </div>
          ),
        };
      }
    }
    return dataSource;
  };

  returnResults = (searchTerm, dataSource) => {
    searchTerm = searchTerm.replace(/\s+/g, "").toLowerCase();
    if (searchTerm.length > 0) {
      return dataSource.filter((result) => {
        return typeof result["primaryText"] === "object"
          ? result["primaryText"].props.label
              .replace(/\s+/g, "")
              .toLowerCase()
              .indexOf(searchTerm) !== -1
          : result["primaryText"]
              .toLowerCase()
              .replace(/\s+/g, "")
              .indexOf(searchTerm) !== -1;
      });
    }
  };

  changeDataSourceAndResultsOnClick = () => {
    let { selectedEmployeeId, searchTerm } = this.state;
    const { prepareRawDataToFormat, generateDataSource, returnResults } = this;
    const { APIData } = this.props;
    const rawDataSource = prepareRawDataToFormat(APIData);
    this.setState({ dataSource: rawDataSource });
    const allResultData = generateDataSource(prepareRawDataToFormat(APIData));
    const realResults = returnResults(searchTerm, allResultData);
    if (searchTerm) {
      const resultsAfterClick = this.changeClickedItem(realResults, selectedEmployeeId);
      this.setState({ results: resultsAfterClick });
    }

    const dataSourceAfterClick = this.changeClickedItem(rawDataSource, selectedEmployeeId);
    this.setState({ dataSource: dataSourceAfterClick });
  };

  onEmployeeChosen = (item, index) => {
    let { handleFieldChange } = this.props;
    const isEmployeeDirectory = window.location.href.includes("employee-directory") ? true : false;
    if (item.toplevel !== "true" && !isEmployeeDirectory) {
      const isReassignScreen = window.location.href.includes("reassign-complaint") ? true : false;
      handleFieldChange("assignee", item.id);
      const intent = isReassignScreen ? "reassign" : "assign";
      handleFieldChange("action", intent);
      this.setState({ selectedEmployeeId: item.id }, () => this.changeDataSourceAndResultsOnClick());
    }
  };

  renderList = (dataSource, enableClick) => {
    return (
      <List
        onItemClick={this.onEmployeeChosen}
        listItemStyle={{ paddingTop: "8px", paddingBottom: "8px", paddingLeft: "8px", background: "#ffffff" }}
        nestedListStyle={{ padding: "0px" }}
        autoGenerateNestedIndicator={false}
        primaryTogglesNestedList={true}
        innerDivStyle={{
          paddingTop: "8px",
          paddingRight: "0px",
          paddingBottom: "8px",
          paddingLeft: "72px",
          margin: 0,
        }}
        items={dataSource}
      />
    );
  };

  autoSuggestCallback = (results = [], searchTerm) => {
    this.setState({ results, searchTerm }, () => this.changeDataSourceAndResultsOnClick());
  };

  generateDataSource = (dataSource) => {
    return (
      dataSource &&
      dataSource.reduce((transformedDataSource, source) => {
        return transformedDataSource.concat(source.nestedItems);
      }, [])
    );
  };

  submitAssignee = (formKey, label, serviceRequestId) => {
    let { submitForm } = this.props;
    let { selectedEmployeeId } = this.state;
    selectedEmployeeId && submitForm(formKey);
  };

  render() {
    let { APIData } = this.props || [];
    let { prepareResultsForDisplay, renderList, generateDataSource, prepareRawDataToFormat } = this;
    const { dataSource } = this.state;
    const realDataSource = generateDataSource(prepareRawDataToFormat(APIData));
    const { results, searchTerm } = this.state;
    const displayInitialList = searchTerm.length === 0 ? true : false;
    const isEmployeeDirectory = window.location.href.includes("employee-directory") ? true : false;
    const isReassignScreen = window.location.href.includes("reassign-complaint") ? true : false;
    const assignstatus = isReassignScreen ? "ES_ASSIGN_STATUS_REASSIGN" : "ES_ASSIGN_STATUS_ASSIGN";
    const { serviceRequestId, formKey } = this.props;
    return (
      <div>
        <Card
          className="assign-complaint-main-card"
          textChildren={
            <div className="form-without-button-cont-generic">
              <div className="employee-search-cont">
                {isEmployeeDirectory ? (
                  ""
                ) : (
                  <Label label={`${assignstatus}`} labelStyle={this.mainLabelStyle} containerStyle={{ padding: "0 40px 0 0" }} />
                )}

                <AutoSuggest
                  id="employee-search"
                  containerStyle={{
                    margin: "16px 0",
                    padding: "0 8px",
                    background: "#f8f8f8",
                  }}
                  textFieldStyle={{ border: 0 }}
                  searchInputText={<Label label="ES_COMMON_SEARCH_EMPLOYEE" />}
                  searchKey="primaryText.props.label"
                  iconStyle={{ right: 15, left: "inherit" }}
                  hintStyle={{ letterSpacing: 0, bottom: 10, fontSize: 14 }}
                  iconPosition="after"
                  callback={this.autoSuggestCallback}
                  dataSource={realDataSource}
                />
              </div>
              <div className="employee-list-cont">
                {displayInitialList
                  ? renderList(prepareResultsForDisplay(dataSource), false)
                  : isEmployeeDirectory
                  ? renderList(prepareResultsForDisplay(results), false)
                  : renderList(prepareResultsForDisplay(results), true)}
              </div>
            </div>
          }
        />
        {!isEmployeeDirectory && (
          <div className="responsive-action-button-cont assign-button">
            <Button
              className="responsive-action-button"
              primary={true}
              fullWidth={true}
              label={<Label buttonLabel={true} label={isReassignScreen ? "ES_COMMON_REASSIGN" : "ES_COMMON_ASSIGN"} />}
              onClick={() => this.submitAssignee(formKey, isReassignScreen ? "RE-ASSIGN" : "ASSIGN", serviceRequestId)}
            />
          </div>
        )}
      </div>
    );
  }
}
