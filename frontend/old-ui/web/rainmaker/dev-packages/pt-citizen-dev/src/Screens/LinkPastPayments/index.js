import React, { Component } from "react";
import { Screen } from "modules/common";
import PastPaymentList from "./PastPaymentList";
import "./index.css";

class LinkLastPayments extends Component {
  state = {
    items: [
      {
        primaryText: "2016 - 2017",
      },
      {
        primaryText: "2017 - 2018",
      },
      {
        primaryText: "2017 - 2018",
      },
      {
        primaryText: "2018 - 2019",
      },
      {
        primaryText: "2018 - 2019",
      },
    ],
  };
  render() {
    return (
      <Screen className="pt-home-screen">
        <PastPaymentList
          items={this.state.items}
          header="Have you paid yor property tax before?"
          subHeader="If yes, please indicate below to link your payments"
        />
      </Screen>
    );
  }
}

export default LinkLastPayments;
