import React from "react";
import { storiesOf, addDecorator } from "@storybook/react";
import { muiTheme } from "storybook-addon-material-ui";
import { action } from "@storybook/addon-actions";
import List from "../components/List";
import theme from "../config/theme";
import CommunicationCall from "material-ui/svg-icons/communication/call";
import CommunicationEmail from "material-ui/svg-icons/communication/email";

const items = [
  {
    leftIcon: <CommunicationCall />,
    style: { float: "left" },
  },
  {
    leftIcon: <CommunicationEmail />,
    style: { float: "left" },
  },
];
items.map((item, index) => {
  item.handler = () => {
    alert(`${index} is clicked`);
  };
});

storiesOf("socialShare", module)
  .addDecorator(muiTheme([theme]))
  .add("share", () => <List items={items} />);
