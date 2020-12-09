import React from "react";

import SubmitBar from "./SubmitBar";

export default {
  title: "Atom/SubmitBar",
  component: SubmitBar,
};

const Template = (args) => <SubmitBar {...args} />;

export const Default = Template.bind({});
Default.args = {
  submit: false,
  style: {},
  label: "Click me",
  onSubmit: undefined,
};
