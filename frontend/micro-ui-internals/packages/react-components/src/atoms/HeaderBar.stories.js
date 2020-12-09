import React from "react";

import HeaderBar from "./HeaderBar";

export default {
  title: "Atom/HeaderBar",
  component: HeaderBar,
};

const Template = (args) => <HeaderBar {...args} />;

export const Default = Template.bind({});

Default.args = {
  start: "First",
  main: "Second",
  end: "Third",
};
