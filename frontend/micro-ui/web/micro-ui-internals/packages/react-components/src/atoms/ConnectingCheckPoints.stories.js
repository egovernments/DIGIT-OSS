import React from "react";

import { CheckPoint } from "./ConnectingCheckPoints";

export default {
  title: "Atom/CheckPoint",
  component: CheckPoint,
};

const Template = (args) => <CheckPoint {...args} />;

export const Default = Template.bind({});

Default.args = {
  isCompleted: true,
  key: 234234,
  label: "First checkpoint",
  info: "This is the first checkpoint",
};
