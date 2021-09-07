import React from "react";

import CheckBox from "./CheckBox";

export default {
  title: "Atom/CheckBox",
  component: CheckBox,
};

const Template = (args) => <CheckBox {...args} />;

export const Default = Template.bind({});

Default.args = {
  label: "Agree to terms and conditions",
};
