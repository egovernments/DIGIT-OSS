import React from "react";

import DetailsCard from "./DetailsCard";

export default {
  title: "Molecule/DetailsCard",
  component: DetailsCard,
};

const Template = (args) => <DetailsCard {...args} />;

export const Default = Template.bind({});

Default.args = {
  data: [{ Name: "Joe Doe", City: "San Francisco" }],
};
