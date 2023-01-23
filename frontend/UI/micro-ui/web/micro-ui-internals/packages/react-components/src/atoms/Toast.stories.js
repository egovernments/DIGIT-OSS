import React from "react";

import Toast from "./Toast";

export default {
  title: "Atom/Toast",
  component: Toast,
};

const Template = (args) => <Toast {...args} />;

export const Default = Template.bind({});

Default.args = {
  label: "Successful",
};
