import React from "react";
import { storiesOf, addDecorator } from "@storybook/react";
import { muiTheme } from "storybook-addon-material-ui";
import { action } from "@storybook/addon-actions";
import { MapLocation } from "../components";
import theme from "../config/theme";
import pinIcon from "../assets/mapPin.png";

var currLoc = {};
var showMyAddress = true;
var myLocation = { lat: 12.972442, lng: 77.580643 };

if (showMyAddress === true && myLocation) {
  currLoc = myLocation;
} else if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((position) => {
    currLoc = { lat: position.coords.latitude, lng: position.coords.longitude };
  });
}

const setPickedLocation = (lat, lng, index) => {
  if (_.isUndefined(index)) index = 0;
};

const styles = {
  boxSizing: `border-box`,
  border: `1px solid transparent`,
  width: `65%`,
  height: `32px`,
  marginTop: `10px`,
  padding: `0 12px`,
  borderRadius: `3px`,
  boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
  fontSize: `14px`,
  outline: `none`,
  textOverflow: `ellipses`,
};

storiesOf("MapLocation", module)
  .addDecorator(muiTheme([theme]))
  .add("with a marker", () => <MapLocation currLoc={currLoc} styles={styles} setLocation={setPickedLocation} icon={pinIcon} />);
