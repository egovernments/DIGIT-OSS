import React, { Component } from "react";
import { TextFieldIcon } from "components";
import SearchIcon from "material-ui/svg-icons/action/search";

const iconStyle = {
  paddingLeft: "10px",
  height: "20px",
  width: "35px",
  fill: "#767676",
};

export default class SearchService extends Component {
  state = {
    inputValue: "",
  };
  render() {
    const { inputValue } = this.state;
    return (
      <TextFieldIcon
        textFieldStyle={{ height: "48px" }}
        inputStyle={{
          marginTop: "8px",
          left: 0,
          textIndent: 40,
          position: "absolute",
        }}
        iconPosition="before"
        underlineShow={false}
        fullWidth={true}
        hintText="Tell us what you need"
        Icon={SearchIcon}
        value={inputValue}
        id="find-services"
        iconStyle={iconStyle}
        className="search-input-style"
      />
    );
  }
}
