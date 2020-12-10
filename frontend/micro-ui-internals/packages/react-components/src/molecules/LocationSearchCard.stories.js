import React from "react";

import LocationSearchCard from "./LocationSearchCard";

export default {
  title: "Molecule/LocationSearchCard",
  component: LocationSearchCard,
};

const Template = (args) => <LocationSearchCard {...args} />;

export const Default = Template.bind({});

Default.args = {
  header: "Header",
  cardText: "Card Text",
  nextText: "Next Text",
  skipAndContinueText: "Skip",
  skip: true,
};
