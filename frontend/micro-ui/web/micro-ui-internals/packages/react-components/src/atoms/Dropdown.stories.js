import React from "react";

import Dropdown from "./Dropdown";

export default {
  title: "Atom/Dropdown",
  component: Dropdown,
};

const Template = (args) => <Dropdown {...args} />;

export const Default = Template.bind({});

Default.args = {
  selected: "first",
  option: ["first", "second", "third"],
  optionKey: 0,
};
