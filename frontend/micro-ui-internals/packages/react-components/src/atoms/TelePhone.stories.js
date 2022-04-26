import React from "react";

import TelePhone from "./TelePhone";

export default {
  title: "Atom/TelePhone",
  component: TelePhone,
};

const Template = (args) => <TelePhone {...args} />;

export const Default = Template.bind({});
Default.args = {
  mobile: "9292929929",
  text: "Joe Doe",
};
