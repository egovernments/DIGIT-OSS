import React, { Component } from "react";
import Event from "./components/Event";
import Screen from "modules/common/common/Screen";

class Events extends Component {
  events = [
    {
      name: "Ward 10 council meeting",
      location: "Ward 10 Municipal office",
      time: "11 AM to 1PM",
      day: "10",
      month: "March",
    },
    {
      name: "Ward 10 council meeting",
      location: "Ward 10 Municipal office",
      time: "11 AM to 1PM",
      day: "10",
      month: "March",
    },
    {
      name: "Ward 10 council meeting",
      location: "Ward 10 Municipal office",
      time: "11 AM to 1PM",
      day: "10",
      month: "March",
    },
    {
      name: "Ward 10 council meeting",
      location: "Ward 10 Municipal office",
      time: "11 AM to 1PM",
      day: "10",
      month: "March",
    },
    {
      name: "Ward 10 council meeting",
      location: "Ward 10 Municipal office",
      time: "11 AM to 1PM",
      day: "10",
      month: "March",
    },
  ];
  render() {
    const { events } = this;
    return (
      <Screen>
        <Event events={events} />
      </Screen>
    );
  }
}

export default Events;
