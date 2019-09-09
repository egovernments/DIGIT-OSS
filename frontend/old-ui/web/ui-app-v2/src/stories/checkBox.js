import React, { Component } from "react";
import { storiesOf, addDecorator } from "@storybook/react";
import { muiTheme } from "storybook-addon-material-ui";
import { action } from "@storybook/addon-actions";
import theme from "../config/theme";
import { Checkbox } from "../components";

storiesOf("Checkbox", module)
  .addDecorator(muiTheme([theme]))
  .add("Checkbox", () => <CheckboxContainer />);

export default class CheckboxContainer extends Component {
  constructor(props) {
    super(props);
  }
  options = [
    {
      label: "India",
      value: "IN",
    },
    {
      label: "USA",
      value: "US",
    },
    {
      label: "Australia",
      value: "AUS",
    },
  ];

  render() {
    return <Checkbox id="reopencomplaint-radio" name="reopencomplaint-radio" options={this.options} />;
  }
}
