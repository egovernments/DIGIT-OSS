import React from "react";
import { storiesOf, addDecorator } from "@storybook/react";
import { muiTheme } from "storybook-addon-material-ui";
import { action } from "@storybook/addon-actions";
import { ProfileSection } from "../components";
import theme from "../config/theme";
import img from "../assets/people.png";

storiesOf("ProfileSection", module)
  .addDecorator(muiTheme([theme]))
  .add("with Location", () => (
    <ProfileSection
      imgStyle={style}
      cardStyles={cardStyles}
      nameStyle={label1}
      locationStyle={label2}
      name={_label1}
      location={_label2}
      imgSrc={img}
    />
  ));

const style = { borderRadius: "50%", width: 127, height: 127 };
const cardStyles = {
  width: "84.5%",
  height: "auto",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  margin: "0 auto",
  paddingTop: 30,
  paddingBottom: 30,
  backgroundColor: "#e0e0e0",
};
const label1 = {
  paddingTop: 10,
  fontFamily: "Roboto",
  fontSize: 7,
  fontWeight: 500,
  fontStyle: "normal",
  fontStretch: "normal",
  lineHeight: "normal",
  letterSpacing: 0.3,
  color: "#484848",
  padding: 0,
  textTransform: "none",
};
const iconStyle = {
  height: "18px",
  width: "18px",
  paddingTop: 12,
};

const label2 = {
  fontFamily: "Roboto",
  fontSize: 7,
  fontWeight: 500,
  // display: 'none'
};

const _label1 = "Name";
const _label2 = "Location";
