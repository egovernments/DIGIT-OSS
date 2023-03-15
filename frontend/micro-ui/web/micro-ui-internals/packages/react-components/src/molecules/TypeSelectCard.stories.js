import React from "react";

import TypeSelectCard from "./TypeSelectCard";

export default {
  title: "Molecule/TypeSelectCard",
  component: TypeSelectCard,
};

const Template = (args) => <TypeSelectCard {...args} />;

export const Default = Template.bind({});

Default.args = {
  headerCaption: "Header Caption",
  header: "Header",
  cardText: "Card Text",
  submitBarLabel: "Submit",
  selectedOption: "first option",
  menu: ["first option", "second option", "third option"],
  optionsKey: "",
};
