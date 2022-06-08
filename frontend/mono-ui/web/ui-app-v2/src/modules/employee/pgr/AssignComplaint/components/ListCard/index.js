import React, { Component } from "react";
import { Card, Icon, List, Image, AutoSuggest, Button } from "components";
import faceOne from "assets/images/faceOne.jpg";
import Avatar from "material-ui/Avatar";
import Label from "utils/translationNode";
import { getNameFromId } from "utils/commons";
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
    top: 16,
    right: 28,
    margin: "0px",
  };

  prepareRawDataToFormat = (rawData) => {
    let { designationsById, departmentById } = this.props;
    const seperateByDepartment =
      rawData &&
      rawData.reduce((result, item) => {
        if (!result[item.assignments[0].department]) result[item.assignments[0].department] = [];
        result[item.assignments[0].department].push(item);
        return result;
      }, {});
    return (
      seperateByDepartment &&
      Object.keys(seperateByDepartment).map((depDetails, index) => {
        return {
          id: seperateByDepartment[depDetails][0].assignments[0].department,
          primaryText: (
            <Label
              label={getNameFromId(departmentById, seperateByDepartment[depDetails][0].assignments[0].department, "Administration")}
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
                  label={depItem && depItem.assignments && getNameFromId(designationsById, depItem.assignments[0].designation, "Engineer")}
                  style={{ letterSpacing: 0 }}
                />
              ),
              rightIcon: (
                <Icon
                  action="communication"
                  name="call"
                  style={this.callIconStyle}
                  color="#22b25f"
                  onClick={(e) => {
                    e.stopPropagation();
                    const link = `tel:+91${depItem && depItem.mobileNumber}`;
                    window.location.href = link;
                  }}
                />
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
          style: { background: "#f8f8f8", borderLeft: "3px solid #f89a3f" },
          leftAvatar: (
            <div className="avatar-selected" style={{ width: 33, height: 33, background: "#f89a3f", borderRadius: "50%", top: 8, left: 17 }}>
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
          ? result["primaryText"].props.label.toLowerCase().indexOf(searchTerm) !== -1
          : result["primaryText"].toLowerCase().indexOf(searchTerm) !== -1;
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
            <div>
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
          <div className="btn-without-bottom-nav">
            <Button
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
