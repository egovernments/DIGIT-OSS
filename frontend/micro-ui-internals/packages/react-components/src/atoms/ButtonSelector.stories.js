import React from "react";

import ButtonSelector from "./ButtonSelector";

export default {
  title: "Atom/ButtonSelector",
  component: ButtonSelector,
};

const Template = (args) => <ButtonSelector {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  label: "Submit",
  theme: undefined,
  onSubmit: () => alert("You clicked me"),
};

export const Secondary = Template.bind({});
Secondary.args = {
  label: "Submit",
  theme: "border",
  onSubmit: () => alert("You clicked me"),
};
