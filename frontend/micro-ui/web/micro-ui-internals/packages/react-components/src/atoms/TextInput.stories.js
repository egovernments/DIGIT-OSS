import React from "react";

import TextInput from "./TextInput";

export default {
  title: "Atom/TextInput",
  component: TextInput,
};

const Template = (args) => <TextInput {...args} />;

export const Default = Template.bind({});

Default.args = {
  isMandatory: false,
  name: "name",
  placeholder: "Name",
  value: "",
};
