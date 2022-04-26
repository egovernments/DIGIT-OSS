import React from "react";

import DescriptionText from "./DescriptionText";

export default {
  title: "Atom/DescriptionText",
  component: DescriptionText,
};

const Template = (args) => <DescriptionText {...args} />;

export const Default = Template.bind({});

Default.args = {
  text: "This is the description",
};
