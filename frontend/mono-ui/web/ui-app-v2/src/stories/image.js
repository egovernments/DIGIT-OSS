import React from "react";
import { storiesOf, addDecorator } from "@storybook/react";
import { muiTheme } from "storybook-addon-material-ui";
import { Image } from "../components";
import theme from "../config/theme";

// if using img-circle dont use border radius,remember circular images should have a border radius of 50%

storiesOf("Image", module)
  .addDecorator(muiTheme([theme]))
  .add("default usage", () => <Image source="http://via.placeholder.com/350x250" />)
  .add("image with circle", () => (
    <Image className="img-circle" style={{ borderRadius: "50%", width: "100px", height: "100px" }} source="http://via.placeholder.com/350x250" />
  ));
