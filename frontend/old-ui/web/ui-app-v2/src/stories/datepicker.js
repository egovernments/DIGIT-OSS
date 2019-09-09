import React from "react";
import { storiesOf, addDecorator } from "@storybook/react";
import { muiTheme } from "storybook-addon-material-ui";
import { action } from "@storybook/addon-actions";
import { DatePicker } from "../components";
import theme from "../config/theme";
import Wrapper from "./wrapper.js";

storiesOf("DatePicker", module)
  .addDecorator(muiTheme([theme]))
  .add("All feature", () => (
    <Wrapper
      imports={[`import { DatePicker } from "<Egov-Reusable-Components-Location>";`]}
      component={`DatePicker`}
      code={`<DatePicker
          onChange={action("clicked")}
          autoOk={true}
          floatingLabelText="Test Date Picker"
      />`}
    >
      <DatePicker onChange={action("clicked")} autoOk={true} floatingLabelText="Test Date Picker" />
      <br />
      <br />
      <div>
        For more props information please visit{" "}
        <a href="http://www.material-ui.com/#/components/date-picker" target="_blank">
          Date picker
        </a>
      </div>
    </Wrapper>
  ));
