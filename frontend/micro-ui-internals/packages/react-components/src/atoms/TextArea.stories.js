import React from "react";

import TextArea from "./TextArea";

export default {
  title: "Atom/TextArea",
  component: TextArea,
};

const Template = (args) => <TextArea {...args} />;

export const Default = Template.bind({});
Default.args = {
  name: "Description",
  ref: undefined,
  value: "This is a description",
  onChange: undefined,
};
