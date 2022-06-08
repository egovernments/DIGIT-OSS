import React from "react";
import { storiesOf, addDecorator } from "@storybook/react";
import { muiTheme } from "storybook-addon-material-ui";
import { action } from "@storybook/addon-actions";
import { Ratings } from "../components";
import theme from "../config/theme";

storiesOf("Ratings", module)
  .addDecorator(muiTheme([theme]))
  .add("All feature", () => <Ratings size={50} count={5} onChange={action(`new value is`)} />);
