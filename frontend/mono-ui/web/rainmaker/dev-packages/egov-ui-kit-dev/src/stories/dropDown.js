import React, { Component } from "react";
import { storiesOf, addDecorator } from "@storybook/react";
import { muiTheme } from "storybook-addon-material-ui";
import { action } from "@storybook/addon-actions";
import theme from "../config/theme";
import { DropDown } from "../components";
import MenuItem from "material-ui/MenuItem";

storiesOf("DropDown", module)
  .addDecorator(muiTheme([theme]))
  .add("Select", () => <DropDownContainer />);

export default class DropDownContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [
        {
          value: "India",
          label: "IN",
        },
        {
          value: "USA",
          label: "US",
        },
        {
          value: "Australia",
          label: "AUS",
        },
      ],
      style: {
        baseStyle: {
          background: "#f2f2f2",
          height: "56px",
          paddingLeft: "10px",
        },
        label: {
          color: "#5F5C57",
        },
      },
      value: "India",
    };
  }

  onChange = (event, index, value) => {
    this.setState({ value });
  };

  render() {
    return (
      <DropDown
        onChange={this.onChange}
        style={this.state.style.baseStyle}
        labelStyle={this.state.style.label}
        dropDownData={this.state.items}
        value={this.state.value}
      />
    );
  }
}
