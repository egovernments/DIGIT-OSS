import React from "react";
import { storiesOf, addDecorator } from "@storybook/react";
import { muiTheme } from "storybook-addon-material-ui";
import { action } from "@storybook/addon-actions";
import Paper from "material-ui/Paper";
import BottomNavigation from "../components/BottomNavigation";
import theme from "../config/theme";

//Web font loader
import WebFont from "webfontloader";
// fonts
import FontIcon from "material-ui/FontIcon";
import IconLocationOn from "material-ui/svg-icons/communication/location-on";
const recentsIcon = <FontIcon className="material-icons">restore</FontIcon>;
const favoritesIcon = <FontIcon className="material-icons">favorite</FontIcon>;
const nearbyIcon = <IconLocationOn />;

// load material icons
WebFont.load({
  google: {
    families: ["Material+Icons"],
  },
});

const options = [
  {
    label: "Recents",
    icon: recentsIcon,
    route: "/recents",
  },
  {
    label: "Favourites",
    icon: favoritesIcon,
    route: "/favourites",
  },
  {
    label: "Nearby",
    icon: nearbyIcon,
    route: "/nearby",
  },
];

storiesOf("Bottom Navigation", module)
  .addDecorator(muiTheme([theme]))
  .add("with options", () => (
    <Paper zDepth={1}>
      <BottomNavigation selectedIndex={0} options={options} handleChange={action("clicked")} />
    </Paper>
  ));
