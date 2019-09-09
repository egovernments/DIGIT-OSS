import React from "react";
import { storiesOf, addDecorator } from "@storybook/react";
import { muiTheme } from "storybook-addon-material-ui";
import { action } from "@storybook/addon-actions";

import { AppBar } from "../components";
import Badge from "material-ui/Badge";
import IconButton from "material-ui/IconButton";
import NotificationsIcon from "material-ui/svg-icons/social/notifications";

import theme from "../config/theme";
import Wrapper from "./wrapper.js";

storiesOf("AppBar", module)
  .addDecorator(muiTheme([theme]))
  .add("All feature", () => (
    <Wrapper
      imports={[
        `import { AppBar} from "<Egov-Reusable-Components-Location>";`,
        `import Badge from "material-ui/Badge";`,
        `import IconButton from "material-ui/IconButton";`,
        `import NotificationsIcon from "material-ui/svg-icons/social/notifications";`,
      ]}
      component={"AppBar"}
      code={`<AppBar
        title="Mseva / Home"
        iconElementRight={
          <Badge
            badgeContent={10}
            secondary={true}
            badgeStyle={{ top: 2, right: 2}}
            style={{padding:"0"}}
          >
            <IconButton style={{color:"white"}} tooltip="Notifications" onClick={action("notification clicked")}>
              <NotificationsIcon />
            </IconButton>
          </Badge>
        }
        onLeftIconButtonClick={action("menu clicked")}
      />`}
    >
      <AppBar
        title="Mseva / Home"
        iconElementRight={
          <Badge badgeContent={10} secondary={true} badgeStyle={{ top: 2, right: 2 }} style={{ padding: "0" }}>
            <IconButton tooltip="Notifications" onClick={action("notification clicked")}>
              <NotificationsIcon color={"white"} />
            </IconButton>
          </Badge>
        }
        onLeftIconButtonClick={action("menu clicked")}
      />
      <br />
      <br />
      <div>
        For more props information please visit{" "}
        <a href="http://www.material-ui.com/#/components/app-bar" target="_blank">
          AppBar
        </a>
      </div>
    </Wrapper>
  ));
