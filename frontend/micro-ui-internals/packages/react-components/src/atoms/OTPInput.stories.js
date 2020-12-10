import React from "react";

import OTPInput from "./OTPInput";

export default {
  title: "Atom/OTPInput",
  component: OTPInput,
};

const Template = (args) => <OTPInput {...args} />;

export const Default = Template.bind({});

Default.args = {
  length: 4,
};
