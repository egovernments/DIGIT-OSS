import React from "react";
import { storiesOf, addDecorator } from "@storybook/react";
import { muiTheme } from "storybook-addon-material-ui";
import { action } from "@storybook/addon-actions";
import { TextField } from "../components";
import theme from "../config/theme";
import Wrapper from "./wrapper.js";

storiesOf("TextField", module)
  .addDecorator(muiTheme([theme]))
  .add("All feature", () => (
    <Wrapper
      imports={[`import { TextField } from "<Egov-Reusable-Components-Location>";`]}
      component={`TextField`}
      code={`<TextField
              label="Test"
              isRequired={true}
              errorMessage={"please enter valid"}
              value={"test Value"}
              disabled=false
              hide=floatingLabelStyle
              className={""}
              onChange={action("clicked")}
      />`}
    >
      <TextField
        label="Test"
        isRequired={true}
        errorMessage="Please enter a valid Message"
        value="test Value"
        disabled={false}
        hide={false}
        className=""
        onChange={action("clicked")}
      />
    </Wrapper>
  ));
