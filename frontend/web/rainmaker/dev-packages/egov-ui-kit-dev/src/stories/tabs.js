import React from "react";
import { storiesOf, addDecorator } from "@storybook/react";
import { muiTheme } from "storybook-addon-material-ui";
import { action } from "@storybook/addon-actions";
import Tabs from "../components/Tabs";
import theme from "../config/theme";

const tabs = [
  {
    label: "My Complaints",
    route: "/my-complaints",
  },
  {
    label: "Around Me",
    route: "/around-me",
  },
];

storiesOf("Tabs", module)
  .addDecorator(muiTheme([theme]))
  .add("with options", () => <Tabs tabs={tabs} onActive={action("clicked")} />);
