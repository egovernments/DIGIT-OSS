import React, { Component } from "react";
import PoliceStation from "./components/PoliceStation";
import Screen from "modules/common/common/Screen";

class PoliceStations extends Component {
  stations = [
    {
      name: "Mohali Police Station",
      ratings: "4.1",
      distance: "1.2 kms",
    },
    {
      name: "Amritsar Police Station",
      ratings: "3.0",
      distance: "5.0 kms",
    },
    {
      name: "Chandigarh Police Station",
      ratings: "2.1",
      distance: "8.0 kms",
    },
    {
      name: "Ludhiana Police Station",
      ratings: "4.1",
      distance: "13.0 kms",
    },
  ];
  render() {
    const { stations } = this;
    return (
      <Screen>
        <PoliceStation stations={stations} />
      </Screen>
    );
  }
}

export default PoliceStations;
