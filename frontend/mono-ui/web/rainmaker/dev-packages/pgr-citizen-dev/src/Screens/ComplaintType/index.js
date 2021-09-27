import React, { Component } from "react";
import { connect } from "react-redux";
import { List, Icon, AutoSuggest } from "components";
import { handleFieldChange } from "egov-ui-kit/redux/form/actions";
import Label from "egov-ui-kit/utils/translationNode";
import { getNestedObjFormat } from "./complaintTypeDataMaker";

const customIconStyles = {
  height: 25,
  width: 25,
  margin: 0,
  top: 10,
  left: 12,
};

class ComplaintType extends Component {
  state = { results: [], searchTerm: "", dataSource: [], transformedDataSource: [] };

  componentDidMount = () => {
    this.generateDataSource();
  };

  generateResultsForAutoComplete = (categoryList, transformedDataSource) => {
    categoryList.forEach((item) => {
      if (item.hasOwnProperty("nestedItems") && item.nestedItems.length) {
        this.generateResultsForAutoComplete(item.nestedItems, transformedDataSource);
      } else {
        transformedDataSource.push(item);
      }
    });
  };

  generateDataSource = () => {
    const { categories } = this.props;
    const categoryList = getNestedObjFormat(categories);
    const transformedDataSource = [];
    this.generateResultsForAutoComplete(categoryList, transformedDataSource);
    this.setState({ dataSource: categoryList, transformedDataSource });
  };

  onComplaintTypeChosen = (item, index) => {
    this.props.handleFieldChange("complaint", "complaintType", item.id);
    this.props.history.goBack();
  };

  autoSuggestCallback = (results = [], searchTerm) => {
    this.setState({ results, searchTerm });
  };

  prepareListItem = (item) => {
    const listItem = {};
    const { displayKey, id, icon } = item;
    listItem.primaryText = <Label label={displayKey} />;
    listItem.id = id;
    listItem.leftIcon = <Icon style={customIconStyles} action="custom" name={icon} color="#f89a3f" />;
    return listItem;
  };

  prepareResultsForDisplay = (results = []) => {
    return results.map((result) => {
      const listItem = this.prepareListItem(result);
      if (result.nestedItems && result.nestedItems.length) {
        // listItem.rightIcon = <Icon action="hardware" name="keyboard-arrow-right" />;
        listItem.nestedItems = this.prepareResultsForDisplay(result.nestedItems);
      } else {
        listItem.onClick = this.onComplaintTypeChosen.bind(null, result);
      }
      return listItem;
    });
  };

  renderList = (dataSource, enableClick) => {
    return (
      <List
        onItemClick={enableClick && this.onComplaintTypeChosen}
        listItemStyle={{ borderBottom: "1px solid #e0e0e0", paddingTop: "8px", paddingBottom: "8px" }}
        nestedListStyle={{ padding: "0px", background: "#f2f2f2" }}
        autoGenerateNestedIndicator={true}
        primaryTogglesNestedList={true}
        items={dataSource}
      />
    );
  };

  render() {
    const { autoSuggestCallback, prepareResultsForDisplay } = this;
    const { results, searchTerm } = this.state;
    const displayInitialList = searchTerm.length === 0 ? true : false;
    const { transformedDataSource, dataSource } = this.state;
    return (
      <div style={{ marginBottom: 60 }}>
        <AutoSuggest
          id="complainttype-search"
          containerStyle={{
            overflowX: "hidden",
            padding: "0px 16px 16px 16px",
            background: "#00bcd1",
            boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.24), 0 0 4px 0 rgba(0, 0, 0, 0.12)",
          }}
          textFieldStyle={{ boxShadow: "0 2px 2px 0 rgba(0, 0, 0, 0.24), 0 0 2px 0 rgba(0, 0, 0, 0.12)", background: "#ffffff" }}
          dataSource={transformedDataSource}
          searchInputText="Search"
          searchKey="text"
          callback={autoSuggestCallback}
          autoFocus={false}
        />
        {displayInitialList ? this.renderList(prepareResultsForDisplay(dataSource)) : this.renderList(prepareResultsForDisplay(results), true)}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    categories: state.complaints.categoriesById,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleFieldChange: (formKey, fieldKey, value) => dispatch(handleFieldChange(formKey, fieldKey, value)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ComplaintType);
