import React, { Component } from "react";
import { connect } from "react-redux";
import { getCityNameByCode } from "utils/commons";
import { List, Dialog, TextFieldIcon, AutoSuggest } from "components";
import DownArrow from "material-ui/svg-icons/navigation/arrow-drop-down";

class CityPickerDialog extends Component {
  state = { results: [], searchTerm: "", open: false };

  componentDidMount = async () => {
    document.getElementById("person-city").addEventListener("focus", function() {
      this.blur();
    });
  };

  componentWillUnmount() {
    document.getElementById("person-city").removeEventListener("focus", null);
  }

  prepareResultsForDisplay = (results = []) => {
    return results.map((result, index) => {
      const mappedResult = {};
      mappedResult.key = result.key;
      mappedResult.primaryText = result.text;
      mappedResult.id = result.key;
      return mappedResult;
    });
  };

  onCityFieldClicked = () => {
    this.setState({
      open: true,
      searchTerm: "",
    });
  };

  onClose = () => {
    this.setState({ open: false });
  };

  onItemClick = (item, index) => {
    const { key } = item;
    if (key) {
      const { fieldKey, onChange } = this.props;
      onChange(fieldKey, key);
      this.onClose();
    }
  };

  autoSuggestCallback = (results = [], searchTerm) => {
    if (results.length === 0) {
      results.push({ key: "", text: "No City Found" });
    }
    this.setState({ results, searchTerm });
  };

  render() {
    const { autoSuggestCallback, prepareResultsForDisplay, onClose, onCityFieldClicked, onItemClick } = this;
    const { results, searchTerm, open } = this.state;
    const { field, cities } = this.props;
    const displayInitialList = searchTerm.length === 0 ? true : false;
    return (
      <div>
        <div onClick={onCityFieldClicked}>
          <TextFieldIcon
            {...field}
            errorStyle={{ bottom: "0px" }}
            value={getCityNameByCode((field || {}).value, cities)}
            id="person-city"
            iconPosition="after"
            Icon={DownArrow}
          />
        </div>
        <Dialog
          className="citipicker-dialog"
          titleStyle={{ textAlign: "left", padding: "24px 16px" }}
          handleClose={onClose}
          bodyStyle={{ padding: "0px", overflowX: "hidden", maxHeight: "100%", minHeight: "100px" }}
          title="Choose City"
          modal={false}
          open={open}
          autoScrollBodyContent={true}
          onRequestClose={onClose}
          style={{
            paddingTop: "0",
            marginTop: "-30px",
            bottom: "0",
            height: "auto",
          }}
          isClose={true}
        >
          <AutoSuggest
            id="city-picker-search"
            dataSource={cities}
            searchInputText="Search"
            searchKey="text"
            autoFocus={true}
            callback={autoSuggestCallback}
          />
          <List
            onItemClick={onItemClick}
            innerDivStyle={{ paddingLeft: "50px" }}
            listItemStyle={{ borderBottom: "1px solid #eee" }}
            items={displayInitialList ? prepareResultsForDisplay(cities) : prepareResultsForDisplay(results)}
          />
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const cities = state.common.cities || [];
  return { cities };
};

export default connect(mapStateToProps)(CityPickerDialog);
