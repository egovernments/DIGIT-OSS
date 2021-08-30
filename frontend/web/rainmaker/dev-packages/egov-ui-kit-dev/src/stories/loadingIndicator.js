import React from "react";
import { storiesOf, addDecorator } from "@storybook/react";
import { muiTheme } from "storybook-addon-material-ui";
import { action } from "@storybook/addon-actions";
import theme from "../config/theme";
import { LoadingIndicator } from "../components";

const style = {
  container: {
    height: "100%",
    width: "100%",
    position: "fixed",
    backgroundColor: "rgba(189,189,189,0.5)",
    zIndex: 9998,
    left: 0,
    top: 0,
  },
  containerHide: {
    display: "none",
    position: "relative",
  },
  refresh: {
    display: "block",
    position: "relative",
    zIndex: 9999,
    marginLeft: "48%",
    marginTop: "23%",
  },
};

storiesOf("LoadingIndicator", module)
  .addDecorator(muiTheme([theme]))
  .add("load", () => <LoadingIndicator status="loading" size={40} left={50} top={0} loadingColor="#8B008B" style={style.refresh} />);
