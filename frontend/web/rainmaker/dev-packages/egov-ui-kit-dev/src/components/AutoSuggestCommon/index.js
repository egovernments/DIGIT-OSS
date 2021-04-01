import React, { Component } from "react";
import PropTypes from "prop-types";
import SearchIcon from "material-ui/svg-icons/action/search";
import TextFieldIcon from "../TextFieldIcon";
import get from "lodash/get";
import { sortDropdownNames } from "egov-ui-framework/ui-utils/commons";

export default class AutoSuggest extends Component {
  static propTypes = { callback: PropTypes.func, dataSource: PropTypes.array, searchKey: PropTypes.string };

  state = { inputValue: "" };

  styles = {
    defaultContainerStyle: { background: "#fff", padding: "0px 10px" },
    defaultTextFieldStyle: { border: "1px solid  #e0e0e0", background: "#f7f7f7", height: "48px" ,textAlign:"left" },
    defaultIconStyle: { left: "5px", color: "#767676" },
  };

  filterSuggestion = (suggestion, searchTerm, searchKey) => {
    let searchValue = get(suggestion, searchKey);
    return (
      searchValue
        .toLowerCase()
        .replace(/\s+/g, "")
        .indexOf(searchTerm) !== -1
    );
  };

  fetchSuggestions = (inputValue) => {
    inputValue = inputValue.replace(/\s+/g, "").toLowerCase();
    if (inputValue.length > 0) {
      const { searchKey, dataSource } = this.props;
      return dataSource.filter((result) => this.filterSuggestion(result, inputValue, searchKey)).sort(sortDropdownNames);
    }
  };

  onChange = (e) => {
    const inputValue = e.target.value;
    const suggestions = this.fetchSuggestions(inputValue);
    this.props.callback(suggestions, inputValue);
    this.setState({ inputValue });
  };

  render() {
    const { onChange, styles } = this;
    const { inputValue } = this.state;
    const { containerStyle, textFieldStyle, iconStyle, searchInputText, hintStyle, iconPosition, autoFocus } = this.props;

    return (
      <div style={{ ...styles.defaultContainerStyle, ...containerStyle }} className="search-field-container">
        <TextFieldIcon
          textFieldStyle={{ ...styles.defaultTextFieldStyle, ...textFieldStyle }}
          inputStyle={{ marginTop: "8px"}}
          hintStyle={{bottom: 8, textAlign:"left", ...hintStyle }}
          iconStyle={{ ...styles.defaultIconStyle, ...iconStyle }}
          iconPosition={iconPosition ? iconPosition : "before"}
          underlineShow={false}
          fullWidth={true}
          hintText={searchInputText}
          Icon={SearchIcon}
          onChange={onChange}
          value={inputValue}
          id={this.props.id}
          autoFocus={autoFocus}
         
        />
      </div>
    );
  }
}
