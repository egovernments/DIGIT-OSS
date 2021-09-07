import React from "react";

import InputCard from "./InputCard";

export default {
  title: "Molecule/InputCard",
  component: InputCard,
};

const Template = (args) => <InputCard {...args} />;

export const Default = Template.bind({});

Default.args = {
  texts: {
    headerCaption: "Header Caption",
    header: "Header",
    cardText: "Card Text",
    nextText: "Next",
    skipText: "Skip",
  },
};
