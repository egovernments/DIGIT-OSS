import React from "react";
import { Icon } from "components";
import filter from "lodash/filter";
import isUndefined from "lodash/isUndefined";
import AutoComplete from "material-ui/AutoComplete";
import { withStyles } from "@material-ui/core/styles";
import Label from "egov-ui-kit/utils/translationNode";
import { connect } from "react-redux";
import get from "lodash/get";
import "./index.css";

const styles = (theme) => ({
  root: {
    padding: "2px 4px",
    // margin: "0px 8px",
    position: "fixed",
    top: "75px",
    height: "56px",
    zIndex: "1100",
    display: "flex",
    alignItems: "center",
    boxShadow: "0px 2px rgba(0, 0, 0, 0.23)",
    backgroundColor: "#fff",
    borderRadius: "28px",
  },
  input: {
    marginLeft: 8,
    flex: 1,
    fontSize: "16px",
  },
});

class SearchService extends React.Component {
  state = {
    searchText: "",
  };
  getNameById = (id, dropDownData) => {
    //const { dropDownData } = this.props;
    const filteredArray = filter(dropDownData, { value: id });
    return filteredArray.length > 0 ? filteredArray[0].label : id;
  };

  componentWillReceiveProps(nextProps) {
    const { dropDownData } = nextProps;
    let { getNameById } = this;
    if (!isUndefined(nextProps.value)) {
      this.setState({ searchText: getNameById(nextProps.value, dropDownData) });
    }
  }

  onChangeText = (searchText, dataSource, params) => {
    this.setState({ searchText });
  };

  onSearchClick = (e) => {
    this.setState({
      searchValue: e.target.value,
    });
  };

  getTransformedItems = () => {
    const { menu } = this.props;
    const transformedItems =
      menu &&
      menu
        .filter((item) => item.url === "url")
        .map((item, index) => {
          return {
            label: item.displayName,
            value: item.navigationURL,
          };
        });
    return transformedItems;
  };

  render() {
    const { classes, history } = this.props;
    const { searchText } = this.state;
    const { getNameById, onChangeText, getTransformedItems } = this;

    return (
      <div className={`${classes.root} dashboard-search-main-cont desktopboxalign`}>
        <Icon action="action" name="search" style={{ marginLeft: 12 }} />
        <AutoComplete
          hintText={
            <Label
              label="COMMON_SEARCH_SERVICE_INFORMATION"
              color="rgba(0, 0, 0, 0.38)"
              fontSize={16}
              // containerStyle={{ marginLeft: 10, paddingBottom: 5 }}
            />
          }
          searchText={searchText}
          onNewRequest={(chosenRequest, index) => {
            history.push(chosenRequest.value);
          }}
          onUpdateInput={onChangeText}
          dataSource={getTransformedItems() || []}
          underlineFocusStyle={{ borderBottom: "none", borderTop: "none" }}
          underlineStyle={{ borderBottom: "none", borderTop: "none" }}
          // listStyle={{ padding: "20px 20px 20px 20px" }}
          menuStyle={{ maxHeight: "150px", maxWidth: "600px", marginTop: 10, backgroundColor: "#fff", overflowY: "auto" }}
          dataSourceConfig={{ text: "label", value: "value" }}
          filter={(searchText, key) => {
            return key.toLowerCase().includes(getNameById(searchText) && getNameById(searchText.toLowerCase()));
          }}
        />

        {/* <Icon action="av" name="mic" style={{ marginRight: 12 }} /> */}
      </div>
    );
  }
}

const mapStateToprops = (state) => {
  const menu = get(state.app, "menu");
  return { menu };
};

export default withStyles(styles)(
  connect(
    mapStateToprops,
    null
  )(SearchService)
);
