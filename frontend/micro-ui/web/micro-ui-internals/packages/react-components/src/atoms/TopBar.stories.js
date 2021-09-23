import React from "react";

import TopBar from "./TopBar";

export default {
  title: "Atom/TopBaR",
  component: TopBar,
};

const Template = (args) => <TopBar {...args} />;

export const Default = Template.bind({});

Default.args = {
  img: undefined,
};
