import React, { Component } from "react";
import { Card, Icon } from "components";
import Notification from "./components/Notification";
import Screen from "modules/common/common/Screen";

class Notifications extends Component {
  notifications = [
    {
      title: "Your complaint has been assigned to the concerned department.",
      days: "2 hours ago",
      icon: <Icon action="alert" name="warning" color="#00bbd3" />,
    },

    {
      title: "Your property tax has been assessed and paid successfully.",
      days: "3 hrs ago",
      icon: <Icon action="custom" name="property-tax" color="#00bbd3" />,
    },
    {
      title: "Your complaint has been assigned to the concerned department.",
      days: "2 days ago",
      icon: <Icon action="alert" name="warning" color="#00bbd3" />,
    },
    {
      title: "Your complaint has been assigned to the concerned department.",
      days: "3 days ago",
      icon: <Icon action="alert" name="warning" color="#00bbd3" />,
    },
    {
      title: "Your Water & Sewerage tax has been paid successfully.",
      days: "3 days ago",
      icon: <Icon action="custom" name="water-tap" color="#00bbd3" />,
    },
  ];

  render() {
    const { notifications } = this;
    return (
      <Screen>
        <Card textChildren={<Notification notifications={notifications} />} />
      </Screen>
    );
  }
}

export default Notifications;
