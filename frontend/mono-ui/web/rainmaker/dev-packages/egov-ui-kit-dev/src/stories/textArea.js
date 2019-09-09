import React from "react";
import { storiesOf, addDecorator } from "@storybook/react";
import { muiTheme } from "storybook-addon-material-ui";
import { action } from "@storybook/addon-actions";
import { TextArea } from "../components";
import theme from "../config/theme";

storiesOf("Text Area", module)
  .addDecorator(muiTheme([theme]))
  .add("All feature", () => (
    <TextArea
      label="Test"
      isRequired={true}
      errorMessage="Please enter a valid Message"
      value="test Value"
      disabled={false}
      hide={false}
      className=""
      onChange={action("clicked")}
    />
  ));
