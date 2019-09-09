import React from "react";
import { storiesOf, addDecorator } from "@storybook/react";
import { muiTheme } from "storybook-addon-material-ui";
import { action } from "@storybook/addon-actions";
// icons
import ContentInbox from "material-ui/svg-icons/content/inbox";
import ActionGrade from "material-ui/svg-icons/action/grade";
import ContentSend from "material-ui/svg-icons/content/send";
import ContentDrafts from "material-ui/svg-icons/content/drafts";
import ActionInfo from "material-ui/svg-icons/action/info";
import Avatar from "material-ui/Avatar";
import List from "../components/List";
import theme from "../config/theme";

const items = [
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
  {
    primaryText: "Drafts",
    leftIcon: <ContentDrafts />,
    initiallyOpen: false,
    primaryTogglesNestedList: true,
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

storiesOf("List", module)
  .addDecorator(muiTheme([theme]))
  .add("with options", () => <List items={items} />);
