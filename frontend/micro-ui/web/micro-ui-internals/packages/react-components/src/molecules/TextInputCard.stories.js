import React from "react";

import TextInputCard from "./TextInputCard";

export default {
  title: "Molecule/TextInputCard",
  component: TextInputCard,
};

const Template = (args) => <TextInputCard {...args} />;

export const Default = Template.bind({});

Default.args = {
  header: "Header",
  subHeader: "Sub Header",
  cardText: "Card Text",
  cardLabel: "Card Label",
  nextText: "Next",
  skipAndContinueText: "Skip",
  skip: true,
  textInput: "Text Input",
};
