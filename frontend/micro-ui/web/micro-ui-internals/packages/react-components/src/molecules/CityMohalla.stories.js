import React from "react";

import CityMohalla from "./CityMohalla";

export default {
  title: "Molecule/CityMohalla",
  component: CityMohalla,
};

const Template = (args) => <CityMohalla {...args} />;

export const Default = Template.bind({});

Default.args = {
  header: "Header",
  subHeader: "Sub Header",
  cardText: "Card Text",
  cardLabelCity: "City",
  cardLabelMohalla: "Mohalla",
  nextText: "Next",
  selectedCity: "first city",
  cities: ["first city", "second city", "third city"],
  localities: ["first locality", "second locality", "third locality"],
  selectCity: "first city",
  selectedLocality: "first locality",
};
