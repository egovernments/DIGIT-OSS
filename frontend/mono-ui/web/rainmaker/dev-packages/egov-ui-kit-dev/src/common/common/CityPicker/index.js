import React, { Component } from "react";
import { connect } from "react-redux";
import { getCityNameByCode } from "egov-ui-kit/utils/commons";
import { List, Dialog, TextFieldIcon, AutoSuggest } from "components";
import DownArrow from "material-ui/svg-icons/navigation/arrow-drop-down";
import Label from "egov-ui-kit/utils/translationNode";
import get from "lodash/get";
import { getTranslatedLabel } from "../../../utils/commons";

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

  getLocalizedLabel = (label) => {
    const { localizationLabels } = this.props;
    return getTranslatedLabel(label, localizationLabels);
  };

  prepareResultsForDisplay = (results = []) => {
    return results.map((result, index) => {
      const mappedResult = {};
      mappedResult.key = result.key;
      mappedResult.primaryText = this.getLocalizedLabel(`TENANT_TENANTS_${result.key.toUpperCase().replace(/[.:-\s\/]/g, "_")}`);
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
          title={<Label label="CS_SELECT_CITY_CHOOSE_CITY" fontSize="18px" containerStyle={{ padding: "20px 10px", backgroundColor: "#fff" }} />}
          modal={false}
          open={open}
          autoScrollBodyContent={true}
          onRequestClose={onClose}
          contentStyle={{ width: "90%" }}
          style={{
            paddingTop: "0",
            // marginTop: "-30px",
            bottom: "0",
            height: "auto",
          }}
          isClose={true}
        >
          <AutoSuggest
            id="city-picker-search"
            dataSource={cities}
            searchInputText={<Label label="ACTION_TEST_SEARCH" />}
            searchKey="text"
            autoFocus={false}
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
  const localizationLabels = get(state.app, "localizationLabels", {});
  return { cities, localizationLabels };
};

export default connect(mapStateToProps)(CityPickerDialog);
