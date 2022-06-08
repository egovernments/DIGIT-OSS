import React from "react";
import { storiesOf, addDecorator } from "@storybook/react";
import { muiTheme } from "storybook-addon-material-ui";
import { action } from "@storybook/addon-actions";
import { Dialog } from "../components";
import theme from "../config/theme";
import Label from "../components/Label";

const dialogProps = {
  style: { width: "90%", height: "95%" },
  open: true,
  children: <p>Example</p>,
  actions: [
    <Label
      label="CLOSE"
      onClick={() => {
        alert("clicked close");
      }}
    />,
    <Label
      label="OK"
      onClick={() => {
        alert("clicked ok");
      }}
    />,
  ],
};

storiesOf("Dialog", module)
  .addDecorator(muiTheme([theme]))
  .add("withactions", () => <Dialog dialogProps={dialogProps} />);
