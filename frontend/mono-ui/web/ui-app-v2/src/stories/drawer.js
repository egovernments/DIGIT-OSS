import React from "react";
import { storiesOf, addDecorator } from "@storybook/react";
import { muiTheme } from "storybook-addon-material-ui";
import { action } from "@storybook/addon-actions";

import { Drawer } from "../components";

import RaisedButton from "material-ui/RaisedButton";
import List from "../components/List";
import ContentInbox from "material-ui/svg-icons/content/inbox";
import ActionGrade from "material-ui/svg-icons/action/grade";
import ContentSend from "material-ui/svg-icons/content/send";
import ContentDrafts from "material-ui/svg-icons/content/drafts";
import ActionInfo from "material-ui/svg-icons/action/info";
import Avatar from "material-ui/Avatar";

import theme from "../config/theme";
import Wrapper from "./wrapper.js";

const items = [
  {
    primaryText: "Inbox",
    leftIcon: <ContentInbox />,
  },
  {
    primaryText: "Starred",
    leftIcon: <ActionGrade />,
  },
  {
    primaryText: "Sent Mail",
    leftIcon: <ContentSend />,
  },
  {
    primaryText: "Drafts",
    leftIcon: <ContentDrafts />,
    initiallyOpen: false,
    primaryTogglesNestedList: true,
    style: {
      borderBottom: "none",
    },
    nestedItems: [
      {
        primaryText: "Inbox",
        leftIcon: <ContentInbox />,
        rightAvatar: <Avatar src="http://via.placeholder.com/150x150" />,
      },
      {
        primaryText: "Starred",
        leftIcon: <ActionGrade />,
        rightAvatar: <Avatar src="http://via.placeholder.com/150x150" />,
      },
      {
        primaryText: "Sent Mail",
        leftIcon: <ContentSend />,
        rightAvatar: <Avatar src="http://via.placeholder.com/150x150" />,
      },
    ],
  },
];

storiesOf("Drawer", module)
  .addDecorator(muiTheme([theme]))
  .add("All feature", () => (
    <Wrapper
      imports={[
        `import { Drawer} from "<Egov-Reusable-Components-Location>";`,
        `import Badge from "material-ui/Badge";`,
        `import IconButton from "material-ui/IconButton";`,
        `import NotificationsIcon from "material-ui/svg-icons/social/notifications";`,
      ]}
      component={"Drawer"}
      code={`<DrawerUndockedExample />`}
    >
      <DrawerUndockedExample />
      <br />
      <br />
      <div>
        For more props information please visit{" "}
        <a href="http://www.material-ui.com/#/components/drawer" target="_blank">
          Drawer
        </a>
      </div>
    </Wrapper>
  ));

export default class DrawerUndockedExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  handleToggle = () => this.setState({ open: !this.state.open });

  handleClose = () => this.setState({ open: false });

  render() {
    return (
      <div>
        <RaisedButton label="Open Drawer" onClick={this.handleToggle} />
        <Drawer docked={false} width={304} open={this.state.open} onRequestChange={(open) => this.setState({ open })}>
          <List items={items} listContainerStyle={{ background: "#ffffff" }} listItemStyle={{ borderBottom: "1px solid #e0e0e0" }} />
        </Drawer>
      </div>
    );
  }
}
