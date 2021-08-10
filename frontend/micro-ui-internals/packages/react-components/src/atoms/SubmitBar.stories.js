import React from "react";

import SubmitBar from "./SubmitBar";

export default {
  title: "Atom/SubmitBar",
  component: SubmitBar,
};

const Template = (args) => <SubmitBar {...args} />;

export const SubmitButton = Template.bind({});

SubmitButton.args = {
  submit: true,
  style: {},
  label: "Submit",
  onSubmit: undefined,
};

export const NormalButton = Template.bind({});

NormalButton.args = {
  submit: false,
  style: {},
  label: "Click me",
  onSubmit: undefined,
};
