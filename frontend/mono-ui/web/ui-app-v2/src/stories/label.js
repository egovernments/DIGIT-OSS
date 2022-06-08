import React from "react";
import { storiesOf, addDecorator } from "@storybook/react";
import { muiTheme } from "storybook-addon-material-ui";
import LocationIcon from "material-ui/svg-icons/communication/location-on";
import { action } from "@storybook/addon-actions";
import { Label } from "../components";
import theme from "../config/theme";

storiesOf("Label", module)
  .addDecorator(muiTheme([theme]))
  .add("with text", () => <Label label="Location" />)
  .add("with primary colour", () => <Label primary={true} labelPosition="after" label="Location" />)
  .add("with icon after label", () => <Label labelPosition="before" label="Location" icon={<LocationIcon />} />)
  .add("with icon before label", () => <Label labelPosition="after" label="Location" icon={<LocationIcon />} />);
