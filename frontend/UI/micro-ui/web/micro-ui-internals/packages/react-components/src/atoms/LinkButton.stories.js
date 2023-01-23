import React from "react";

import LinkButton from "./LinkButton";

export default {
  title: "Atom/LinkButton",
  component: LinkButton,
};

const Template = (args) => <LinkButton {...args} />;

export const Default = Template.bind({});

Default.args = {
  label: "Link",
};
