import React from "react";
import { storiesOf, addDecorator } from "@storybook/react";
import { muiTheme } from "storybook-addon-material-ui";
import { action } from "@storybook/addon-actions";
import { TimePicker } from "../components";
import theme from "../config/theme";
import Wrapper from "./wrapper.js";

storiesOf("TimePicker", module)
  .addDecorator(muiTheme([theme]))
  .add("All feature", () => (
    <Wrapper
      imports={[`import { TimePicker } from "<Egov-Reusable-Components-Location>";`]}
      component={`TimePicker`}
      code={`<TimePicker
          onChange={action("clicked")}
          autoOk={true}
          floatingLabelText="Test Date Picker"
      />`}
    >
      <TimePicker onChange={action("clicked")} autoOk={true} floatingLabelText="Test Time Picker" />
      <br />
      <br />
      <div>
        For more props information please visit{" "}
        <a href="http://www.material-ui.com/#/components/time-picker" target="_blank" rel="noopener noreferrer">
          Time picker
        </a>
      </div>
    </Wrapper>
  ));
