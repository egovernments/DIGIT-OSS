import React from "react";
import { storiesOf, addDecorator } from "@storybook/react";
import { muiTheme } from "storybook-addon-material-ui";
import { action } from "@storybook/addon-actions";

import Home from "../screens/Home";

import theme from "../config/theme";
import Wrapper from "./wrapper.js";

storiesOf("PGR Screens", module)
  .addDecorator(muiTheme([theme]))
  .add("Home", () => (
    <Wrapper imports={[`import Home from "../pgr/home";`]} component={"Home"} code={`<Home/>`}>
      <Home />

      <br />
      <br />
      {/*<div>
        For more props information please visit{" "}
        <a
          href="http://www.material-ui.com/#/components/app-bar"
          target="_blank"
        >
          Home
        </a>
      </div>*/}
    </Wrapper>
  ));
